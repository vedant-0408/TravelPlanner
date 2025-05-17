import { Button, DatePicker, Input, Listbox, ListboxItem } from '@nextui-org/react'
import axios from 'axios'
import React, { useState } from 'react'
import { FaCalendarAlt, FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Search = () => {

    const activites = [
        { name: "Sea & Sailing", icon: "/home/ship.svg" },
        { name: "Trekking Tours", icon: "/home/hiking.svg" },
        { name: "City Tours", icon: "/home/trolley-bag.svg" },
        { name: "Motor Sports", icon: "/home/motor-boat.svg" },
        { name: "Jungle Safari", icon: "/home/cedar.svg" },
    ]

    const [searchLocation, setSearchLocation] = useState("");
    const navigate = useNavigate();
    const [dates, setDates] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });

    const [cities, setCities] = useState([]);

    const handleSearch = () => {
        if (searchLocation && dates) {
            navigate(`/trips?city=${searchLocation}&dates=${dates}`);
        }
    }

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

    return (
        <div className='max-w-[100vw] overflow-x-hidden'>
            <div className='h-[80vh] flex items-center justify-center'>
                <div className='absolute left-0 top-0 h-[100vh] w-[100vw] max-w-[100vw] overflow-hidden'>
                    <img src="/home/home-bg.png" className="w-full h-full object-cover" alt="Search" />
                </div>
                <div className='absolute h-[50vh] w-[60vw] flex flex-col gap-5'>
                    <div className="text-white text-center flex flex-col gap-5">
                        <h3 className='text-xl font-bold'>
                            Best Tours made for you in mind!
                        </h3>
                        <h2 className="text-6xl font-extrabold">Explore the exotic world.</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-5 p-5 rounded-xl">
                        <Input
                            color="danger"
                            variant="bordered"
                            className="text-white placeholder:text-white relative h-14"
                            startContent={<FaSearch />}
                            placeholder="Search Location"
                            value={searchLocation}
                            onChange={(e) => {
                                setSearchLocation(e.target.value);
                                searchCities(e.target.value)
                            }}
                        />
                        {
                            cities.length > 0 && (
                                <div className='w-full min-h-[200px] max-w-[315px] border-small rounded-small border-default-200 mt-5 absolute top-48 z-20'>
                                    <div className='bg-cover bg-center bg-no-repeat relative min-h-[200px] h-full w-full px-1 py-2 rounded-small' style={{
                                        backgroundImage: 'url("/home/home-bg.png")'
                                    }}>
                                        <div className='absolute inset-0 bg-black bg-opacity-10 backdrop-blur-md rounded-small'></div>
                                        <Listbox className='rounded-small ' onAction={(key) => {
                                            setSearchLocation(key);
                                            setCities([]);
                                        }}>
                                            {cities.map((city) => {
                                                return <ListboxItem key={city} color='danger' className='text-white'>{city}</ListboxItem>
                                            })}
                                        </Listbox>
                                    </div>
                                </div>
                            )
                        }
                        <DatePicker
                            // selected={dates}
                            // onChange={(date) => setDates(date)}
                            color='danger'
                            variant='bordered'
                            className="text-white relative h-14 placeholder:text-white"
                            customInput={<Input color="danger" variant="bordered" className="text-white accent-danger-500 h-14" placeholder="Select Date" startContent={<FaCalendarAlt />} />}
                        />
                        <Button
                            size="lg"
                            className="h-14 cursor-pointer"
                            color="danger"
                            variant="shadow"
                            onPress={handleSearch}
                        >Search
                        </Button>
                    </div>
                    <div>
                        <ul className='text-white grid grid-cols-5 mt-5'>
                            {activites.map((activity) => {
                                return <li className='flex items-center justify-center gap-5 flex-col cursor-pointer' key={activity.name}>
                                    <div className='p-5 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300'>
                                        <div className='relative h-12 w-12'>
                                            <img src={activity.icon} className="w-full h-full object-cover" alt="Activity" />
                                        </div>
                                    </div>
                                    <span className="text-lg font-medium">{activity.name}</span>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search