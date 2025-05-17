import React from 'react'
import Sidebar from './Sidebar'
import Trips from './Trips';

const TripsLayout = () => {
  return (
    <section className='bg-[#f5f5fe] flex'>
        <Sidebar />
        <section className='flex-1 flex flex-col'>
            <div className='h-48 bg-[#0E1428] text-white flex justify-center flex-col px-10 gap-3'>
                <h1 className="text-5xl">Dashboard</h1>
                <p>All the info about scrapped trips.</p>
            </div>
        <Trips />
        </section>
    </section>
  )
}

export default TripsLayout;