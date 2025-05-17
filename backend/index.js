// backend/server.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import cors from "cors";
import CryptoJS from 'crypto-js';
import { Worker } from 'bullmq';
import { jobsQueue } from './lib/queue.js';
import { connection } from './lib/redis.js';
import puppeteer from 'puppeteer';
import { startLocationScraping } from './scraping/location-scraping.js';
import { startPackageScraping } from './scraping/package-scraping.js';
import { decodeJwt, jwtVerify } from 'jose';
import Razorpay from 'razorpay';
import crypto from "crypto"


const app = express();
const prisma = new PrismaClient();
const secret = process.env.JWT_KEY || 'your-secret-key';
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


const createToken = (email, userId) => {
  return jwt.sign({ email, userId, isAdmin: true }, secret, { expiresIn: '48h' });
};

const createUToken = (email, userId) => {
  return jwt.sign({ email, userId, isAdmin: false }, secret, { expiresIn: '48h' });
};

app.get("/auth/me", async (req, res) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const secr = new TextEncoder().encode(secret);
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    await jwtVerify(token, secr);
    const { userId, isAdmin } = decodeJwt(token);

    if (isAdmin) {
      return res.status(200).json({ userInfo: { isAdmin: true , id: userId, email: "admin@admin.com",
      } });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (user) {
      return res.status(200).json({
        userInfo: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

const worker = new Worker(jobsQueue.name, async (job) => {
  let browser = undefined;
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    console.log("Connected! Navigating to " + job.data.url);
    await page.goto(job.data.url, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });
    console.log("navigated! Scraping page content...");


    if (job.data.jobType.type === "location") {
      const packages = await startLocationScraping(page);
      await prisma.jobs.update({
        where: { id: job.data.id },
        data: { isComplete: true, status: "completed" },
      });

      //creating individual jobs
      for (const pkg of packages) {

        //check if job isnt already created
        const jobCreated = await prisma.jobs.findFirst({
          where: {
            url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`,
          },
        });

        //create if not already created
        if (!jobCreated) {
          const job = await prisma.jobs.create({
            data: {
              url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`,
              jobType: { type: "package" },
            }
          });
          jobsQueue.add("package", { ...job, packageDetails: pkg });
        }
      }
    }
    else if (job.data.jobType.type === "package") {
      //already scraped check
      const alreadyScrapped = await prisma.trips.findUnique({
        where: { id: job.data.packageDetails.id },
      });
      if (!alreadyScrapped) {
        const pkg = await startPackageScraping(page, job.data.packageDetails);
        // console.log(pkg);
        await prisma.trips.create({ data: pkg });
        await prisma.jobs.update({
          where: { id: job.data.id },
          data: { isComplete: true, status: "completed" },
        })
      }
    }

  } catch (error) {
    console.log(error);
    await prisma.jobs.update({
      where: { id: job.data.id },
      data: { isComplete: true, status: "failed" },
    });
    // await browser?.close();
  } finally {
    await browser?.close();
    console.log("Browser closed successfully.")
  }

}, {
  connection: connection,
  concurrency: 10,
  removeOnComplete: { count: 1000 },
  removeOnFail: { count: 5000 },
});

app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.admin.findUnique({
      where: { email, password: CryptoJS.SHA256(password).toString() },
    });

    if (!user) {
      return res.status(404).json({ message: 'Email or password is invalid' });
    }
    const token = createToken(user.email, user.id);
    res.cookie('token', token, { httpOnly: true});

    return res.json({
      token,
      userInfo: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
});

app.post("/admin/create-job", async (req, res) => {
  try {
    const { url, jobType } = req.body;
    const job = await prisma.jobs.create({ data: { url, jobType } });
    await jobsQueue.add("new location", { url, jobType, id: job.id })

    return res.status(201).json({ jobCreated: true, job });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
});

app.get("/admin/get-job", async (req, res) => {
  try {
    const jobs = await prisma.jobs.findMany({ orderBy: { createdAt: "desc" } });
    const onGoingJobs = await prisma.jobs.findMany({ where: { isComplete: false } });
    return res.status(200).json({ jobs, onGoingJobs: onGoingJobs?.length ?? 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
});

app.get("/get-trips", async (req, res) => {
  try {
    const trips = await prisma.trips.findMany({ orderBy: { ScrappedOn: "desc" } });
    if (trips) return res.status(200).json({ trips });
    else return res.status(404).json({ message: "No trips found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
});

app.get("/trips", async (req, res) => {
  try {
    const city = req.query.city;
    const dates = req.query.dates;
    if (city) {
      const allTrips = await prisma.trips.findMany();
      const filteredTrips = allTrips.filter((trip) => {
        const destinationItinerary = trip.destinationItinerary || [];
        return destinationItinerary.some(
          (destination) => destination.placeText.toLowerCase() === city.toLowerCase()
        )
      })
      if (filteredTrips) {
        return res.status(200).json({ trips: filteredTrips });
      } else {
        return res.status(404).json({ message: "No trips found" });
      }
    } else return res.status(400).json({ message: "City is required" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
});

app.get("/get-trip-details", async (req, res) => {
  try {
    const id = req.query.id;
    if (id) {
      const trip = await prisma.trips.findUnique({ where: { id } });
      if (trip) {
        return res.status(200).json({ ...trip });
      } else {
        return res.status(404).json({ message: "No trip found" });
      }
    } else return res.status(400).json({ message: "Id is required" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email, password: CryptoJS.SHA256(password).toString() },
    });

    if (!user) {
      return res.status(404).json({ message: 'Email or password is invalid' });
    }

    const token = createUToken(user.email, user.id);
    res.cookie('token', token, {
      httpOnly: true,
      // secure: false, maxAge: 3600000, sameSite: 'lax' 
    });


    return res.status(200).json({
      token,
      userInfo: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
});

app.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'FirstName, LastName, Email and password are required' });
  }
  try {
    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: CryptoJS.SHA256(password).toString() },
    });

    const token = createUToken(user.email, user.id);
    res.cookie('token', token, { httpOnly: true, secure: false });

    return res.json({
      userInfo: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
    }
    );
  } catch (error) {
    return res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
  }
});

app.post("/create-booking", async (req, res) => {
  const { bookingId, bookingType, userId, taxes, date } = await req.body;
  let bookingDetails;
  switch (bookingType) {
    
    case "trips": {

      try {
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY,
          key_secret: process.env.SECRET_KEY,
        });

        bookingDetails=await prisma.trips.findUnique({
          where:{id:bookingId},
        });

        if (bookingDetails) {
          var options = {
            amount: 100,
            currency: "INR",
            receipt: "order_rctptid_11"
          };
          const orderIntent = await razorpay.orders.create(options);
          if (!orderIntent) {
            return res.status(500).send("Error");
          }

          res.json(orderIntent);

          await prisma.bookings.create({
            data:{
              bookingType,
              bookingTypeId:bookingId.toString(),
              user:{connect:{id:userId}},
              paymentIntent:orderIntent.id,
              totalAmount:orderIntent.amount/100,
              date,
            }
          })

        }
      }catch(error){
        console.log(error);
        res.status(500).send("ERROR");
      }

    }
  }
})

app.post("/booking/validate",async(req,res)=>{
  const{razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
  console.log(razorpay_order_id,razorpay_payment_id,razorpay_signature);
  const sha=crypto.createHmac("sha256",process.env.SECRET_KEY);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest=sha.digest("hex");
  if(digest!==razorpay_signature){
    return res.status(400).json({msg:"transaction is not legit"});
  }
  res.json({
    msg:"success",
    bookingId:razorpay_order_id,
    paymentId:razorpay_payment_id,
  })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
