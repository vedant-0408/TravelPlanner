import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { USER_API_ROUTES } from '../utils/api-routes';
import { FaCalendar, FaCheck, FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { Button, Input, Tab, Tabs } from '@nextui-org/react';
import {IoPerson, IoPricetag} from 'react-icons/io5'
import Itinerary from './Itinerary';
import Image from './Image';

const TripDetails = () => {
    
    const { id:tripId } = useParams();
    const navigate=useNavigate();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const admin_access=useSelector((state)=>state.admin.adminAccess);
    const [tripData,setTripData]=useState([]);
    const [date,setDate]=useState(new Date());

    useEffect(()=>{
        const fetchTripData=async()=>{
            const data=await axios.get(`${USER_API_ROUTES.GET_TRIP_DATA}?id=${tripId}`);
            if(data.data.id){
                setTripData(data.data);
            }
        };
        if(tripId){
            fetchTripData();
        }
    },[tripId])

    const handleDateChange=(event)=>{
        const newDate=event.target.value ? new Date(event.target.value) : new Date();
        setDate(newDate);
    }

    function loadScript(src) {
        return new Promise((resolve) => {
          const script = document.createElement('script')
          script.src = src
          script.onload = () => {
            resolve(true)
          }
          script.onerror = () => {
            resolve(false)
          }
          document.body.appendChild(script)
        })
      }

    const bookTrip=async ()=>{
        const isoDate=date.toISOString();
        console.log(userInfo);
        console.log(admin_access);
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
        if (!res){
            alert('Razropay failed to load!!')
            return 
          }
        const response=await axios.post(USER_API_ROUTES.CREATE_BOOKING,{
            bookingId:tripData?.id,
            bookingType:"trips",
            userId:userInfo?.id,
            taxes:1,
            date:isoDate,
        });

        const options = {
            "key": "rzp_test_stmxdaZy8jiEQv", // Enter the Key ID generated from the Dashboard
            "amount": 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "ARKLYTE Travelling Agency",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": response.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            handler:async function(response){
                const body={
                    ...response,
                }
                const validateRes=await fetch("http://localhost:5000/booking/validate",{
                    method:"POST",
                    body:JSON.stringify(body),
                    headers:{
                        "Content-Type":"application/json",
                    },
                });
                const jsonRes=await validateRes.json();
                console.log(jsonRes);
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        
        const paymentObject = new window.Razorpay(options); 
        paymentObject.open();


        console.log(response);
    }

  return (
    <div>
    { tripData && (
        <>
        <Image images={tripData?.images}/>
        <div className='grid grid-cols-3 my-10 gap-10 mx-32'>
            <div className='col-span-2'>
                <div className="bg-white px-5 py-5 rounded-lg flex flex-col gap-10 text-blue-text-title">
                    <div className='p-10 bg-[#f5f5fe] rounded-lg border border-gray-200 flex flex-col gap-5'>
                        <div className='border-b-2 border-dotted border-gray-400 flex justify-between w-full pb-5'>
                        <h1 className='text-3xl'>
                            <strong className="font-medium">{tripData?.name}</strong>
                        </h1>
                        <ul className="flex gap-4 text-2xl items-center">
                            <li className="cursor-pointer text-blue-500 bg-blue-100 p-3 rounded-full">
                                <FaFacebook />
                            </li>
                            <li className="cursor-pointer text-blue-500 bg-blue-100 p-3 rounded-full">
                                <FaInstagram />
                            </li>
                            <li className="cursor-pointer text-blue-500 bg-blue-100 p-3 rounded-full">
                                <FaTwitter />
                            </li>
                            <li className="cursor-pointer text-blue-500 bg-blue-100 p-3 rounded-full">
                                <FaWhatsapp />
                            </li>
                        </ul>
                        </div>
                        <div>
                            <ul className='grid grid-cols-2 gap-5'>
                            <li>
                                <span>Trip ID:</span>
                                <span className='text-blue-500'>{tripData.id}</span>
                            </li>
                            <li>
                                <span>Duration: </span>
                                <span>{tripData.days} Days , {tripData.nights} Nights</span>
                            </li>
                            <li className='flex gap-4'>
                                <span>Locations Covered:</span>
                                <ul className='flex flex-col gap-5'>
                                    {tripData?.destinationItinerary?.map((destination)=>{
                                        return (
                                            <li key={destination.placeText}>
                                                <span>{destination.placeText}</span>
                                                <span>
                                                    &nbsp;{destination.totalNights} nights
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                            </ul>
                        </div>
                    </div>
                    <div className="px-10 py-10 bg-[#f5f5fe] rounded-lg border border-gray-200 gap-3 flex flex-col">
                        <h3 className="text-2xl">
                            <strong className="font-medium">Overview</strong>
                        </h3>
                        <p>{tripData.description}</p>
                    </div>
                    <div className="px-10 py-10 bg-[#f5f5fe] rounded-lg border border-gray-200 gap-3 flex flex-col">
                        <h3 className="text-2xl">
                            <strong className="font-medium">Tour Highlights</strong>
                        </h3>
                        <ul className="grid grid-cols-4 gap-5 mt-3">
                            {tripData?.themes?.map((theme)=>{
                                return <li key={theme} className='flex gap-2 items-center'>
                                    <span className="text-sm text-blue-500 bg-blue-200 p-2 rounded-full">
                                        <FaCheck />
                                    </span>
                                    <span>{theme}</span>
                                </li>
                            })}
                            {tripData?.inclusions?.map((theme)=>{
                                return <li key={theme} className='flex gap-2 items-center'>
                                    <span className="text-sm text-blue-500 bg-blue-200 p-2 rounded-full">
                                        <FaCheck />
                                    </span>
                                    <span>{theme}</span>
                                </li>
                            })}
                        </ul>
                    </div>
                    <div className="px-10 py-10 bg-[#f5f5fe] rounded-lg border border-gray-200 gap-3 flex flex-col">
                        <h3 className="text-2xl">
                            <strong className="font-medium">Itinerary</strong>
                        </h3>
                        <div>
                            <Itinerary data={tripData?.detailedItinerary}/>
                        </div>
                    </div>
                    <div className="px-10 py-10 bg-[#f5f5fe] rounded-lg border border-gray-200 gap-3 flex flex-col">
                        <h3 className="text-2xl">
                            <strong className="font-medium">Location Overview</strong>
                        </h3>
                        <div>
                            <Tabs variant='bordered' color='primary'>
                                {tripData?.destinationDetails?.map((city)=>{
                                    return <Tab key={city.name} title={city.name} className='flex gap-5'>
                                        <div className='relative h-[200px] w-[20vw]'>
                                            <img src={city.image} className="absolute top-0 left-0 h-full w-full" alt={city.name}></img>
                                        </div>
                                        <p className="flex-1">{city.description}</p>
                                    </Tab>
                                })}
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-white p-5 rounded-lg flex flex-col gap-10 h-max text-blue-text-title'>
                <div className='flex flex-col gap-3'>
                    <h1 className="font-medium text-2xl">Price</h1>
                    <div className="flex gap-2 items-center justify-between">
                        <div className="flex gap-2">
                            <IoPricetag className='text-3xl'></IoPricetag>
                            <span className='text-2xl'>From</span>
                        </div>
                        <span className="text-4xl font-bold">₹{tripData?.price}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <Input endContent={<FaCalendar />}
                    type="date"
                    onChange={handleDateChange}/>
                    <Input endContent={<IoPerson />}
                    placeholder='guests' type="number"/>
                </div>
                <ul className="flex flex-col gap-2">
                    <li className="flex justify-between">
                        <span>Base Price</span>
                        <span>₹{tripData?.price}</span>
                    </li>
                    <li className="flex justify-between">
                        <span>State Price</span>
                        <span>₹800</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Night Price</span>
                        <span>₹500</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Convenience Fee</span>
                        <span>₹1800</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Total Price</span>
                        <span>₹{tripData?.price + 3100}</span>
                    </li>
                </ul>
                <Button color="primary" size="lg" className='rounded-full' onClick={()=>{userInfo && bookTrip()}}>
                    {userInfo ? "Book Trip" : "Login to Book Trip"}
                </Button>
            </div>
        </div>
        </>
    )}
    </div>
  )
}

export default TripDetails