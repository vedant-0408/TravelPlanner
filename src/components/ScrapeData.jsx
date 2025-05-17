import { Button, Card, CardBody, CardFooter, Input, Listbox, ListboxItem, Tab, Tabs } from '@nextui-org/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ADMIN_API_ROUTES } from '../utils';
import ScrapingQueue from './ScrapingQueue';
import { useSelector } from 'react-redux';
import CurrentlyScrapingTable from './CurrentlyScrapingTable';
import { Navigate, useNavigate } from 'react-router-dom';

const ScrapeData = () => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [jobs, setJobs] = useState([]);
    const admin_access = useSelector((state) => state.admin.adminAccess);
    const userInfo = useSelector((state) => state.auth.userInfo);
    const navigate=useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(ADMIN_API_ROUTES.GET_JOB_DETAILS);
                setJobs(response.data.jobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        }

        const interval = setInterval(() => getData(), 3000);
        return () => {
            clearInterval(interval);
        }
    }, [])

    const searchCities = async (searchString) => {
        if (!searchString) {
            setCities([]);
            return;
        }

        try {
            const response = await axios.get(
                `https://secure.geonames.org/searchJSON?q=${searchString}&maxRows=5&username=kishan&style=SHORT`
            );
            const parsed = response.data.geonames;
            setCities(parsed ? parsed.slice(0, 5).map((city) => city.name) : []);
        } catch (error) {
            console.error('Error fetching cities:', error);
            setCities([]);
        }
    };

    const startScraping = async () => {
        try {
            await axios.post(ADMIN_API_ROUTES.CREATE_JOB, {
                url: `https://packages.yatra.com/holidays/intl/search.htm?destination=${selectedCity}`,
                jobType: { type: "location" },
            });
        } catch (error) {
            console.error('Error starting scraping:', error);
        }
    }

    // Loading state
    // if (!userInfo) {
    //     return <div>Loading...</div>;
    // }

    // Check admin access - using Navigate component
    useEffect(() => {
        if (!admin_access) {
          navigate("/login");
        }
      }, [admin_access, navigate]);

    if (!admin_access) {
        return <Navigate to="/login" replace />;
    }

    return (
        <section className='m-10 grid grid-cols-3 gap-5'>
            <Card className='col-span-2'>
                <CardBody>
                    <Tabs>
                        <Tab key="location" title="Location">
                            <Input
                                type="text"
                                label="Search for a location"
                                onChange={(e) => searchCities(e.target.value)}
                            />
                            <div className="w-full min-h-[200px] max-w-[260px] px-1 py-2 rounded-small border-default-200 mt-5 border">
                                <Listbox onAction={(key) => setSelectedCity(cities[key])}>
                                    {cities.length > 0 ? (
                                        cities.map((city, index) => (
                                            <ListboxItem key={index} color="primary" className='text-primary-500'>
                                                {city}
                                            </ListboxItem>
                                        ))
                                    ) : (
                                        <ListboxItem disabled>No cities found</ListboxItem>
                                    )}
                                </Listbox>
                            </div>
                        </Tab>
                    </Tabs>
                </CardBody>
                <CardFooter className='flex flex-col gap-5'>
                    {selectedCity && (
                        <div>
                            <h1 className='text-xl'>Scrape data for {selectedCity}</h1>
                        </div>
                    )}
                    {selectedCity && <Button className='w-full' color='primary' onClick={startScraping}>Scrape</Button>}
                </CardFooter>
            </Card>
            <ScrapingQueue />
            <div className="col-span-3">
                <CurrentlyScrapingTable jobs={jobs} />
            </div>
        </section>
    );
};

export default ScrapeData;