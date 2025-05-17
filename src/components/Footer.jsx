import React from 'react'
import { FaFacebookF, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate=useNavigate();
  return (
    <footer className='min-h-[20vh] px-48 py-10 relative bg-cover bg-center bg-no-repeat' style={{backgroundImage:"url('/home/home-bg.png')"}}>
    <div className='absolute inset-0 bg-black bg-opacity-50 backdrop-blur-2xl'></div>
    <div className="relative z-10 p-4 grid grid-cols-4 gap-20 text-white">
        <div>
            <div className='cursor-poniter' onClick={()=>navigate("/")}>
                <img src="/logo.png" alt="logo" height={80} width={80}></img>
                <span className="text-xl uppercase font-medium italic">
                    <span>ARKLYTE</span>
                </span>
            </div>
            <p>
                Explore seamlessly created tours with our all-in-one travel app.Effortlessly discover,compare,and book flights,hotels,and tours for your next adventure, powered by React.
            </p>
        </div>
        <div className='flex flex-col gap-3 pt-10'>
            <h3 className='text-3xl font-medium text-danger-500 '>Destinations</h3>
            <ul className='flex flex-col gap-1'>
                <li className='cursor-pointer'>USA</li>
                <li className='cursor-pointer'>India</li>
                <li className='cursor-pointer'>France</li>
                <li className='cursor-pointer'>United Kingdom</li>
            </ul>
        </div>
        <div className='flex flex-col gap-3 pt-10'>
            <h3 className='text-3xl font-medium text-danger-500 '>Adventures</h3>
            <ul className='flex flex-col gap-1'>
                <li className='cursor-pointer'>Extreme</li>
                <li className='cursor-pointer'>In the air</li>
                <li className='cursor-pointer'>Nature and Wildlife</li>
                <li className='cursor-pointer'>Outdoor Parks</li>
                <li className='cursor-pointer'>Water Sports</li>
            </ul>
        </div>
        <div className='flex flex-col gap-3 pt-10'>
            <h3 className='text-3xl font-medium text-danger-500 '>Get in Touch</h3>
            <ul className="flex gap-5 mt-5">
                <li className="bg-purple-500 bg-opacity-30 rounded-lg text-purple-500 text-3xl p-3 currsor-pointer">
                    <FaFacebookF />
                </li>
                <li className="bg-purple-500 bg-opacity-30 rounded-lg text-purple-500 text-3xl p-3 currsor-pointer">
                    <FaInstagram />
                </li>
                <li className="bg-purple-500 bg-opacity-30 rounded-lg text-purple-500 text-3xl p-3 currsor-pointer">
                    <FaLinkedin />
                </li>
                <li className="bg-purple-500 bg-opacity-30 rounded-lg text-purple-500 text-3xl p-3 currsor-pointer">
                    <FaTwitter />
                </li>
            </ul>
        </div>

    </div>
    </footer>
  )
}

export default Footer