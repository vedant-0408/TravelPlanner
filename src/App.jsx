import React from 'react'
import { Button } from '@nextui-org/react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Admin from './components/Admin';
import AdminLayout from './components/AdminLayout';
import ScrapeDataLayout from './components/ScrapeDataLayout';
import TripsLayout from './components/TripsLayout';
import HomeLayout from './components/HomeLayout';
import TripOptions from './components/TripOptions';
import TripDetails from './components/TripDetails';
import Search from './components/Search';
import Logout from './components/Logout';

const App = () => {
  return (
    <BrowserRouter>
    <HomeLayout>
    <Routes>
    <Route path="/" element={<Search/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/admin" element={<Admin/>}/>
    <Route path="/admin/dashboard" element={<AdminLayout />} />
    <Route path="/admin/scrape-data" element={<ScrapeDataLayout />} />
    <Route path="/admin/trips" element={<TripsLayout/>} />
    <Route path="/trips" element={<TripOptions />}/>
    <Route path="/trip-details/:id" element={<TripDetails/>} />
    <Route path="/logout" element={<Logout/>} />
    </Routes>
    </HomeLayout>
    </BrowserRouter>
  )
}
export default App