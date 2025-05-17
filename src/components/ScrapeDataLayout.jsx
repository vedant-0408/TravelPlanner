import React from 'react'
import Sidebar from './Sidebar'
import ScrapeData from './ScrapeData'

const ScrapeDataLayout = () => {
  return (
    <section className='bg-[#f5f5fe] flex'>
        <Sidebar />
        <section className='flex-1 flex flex-col'>
            <div className='h-48 bg-[#0E1428] text-white flex justify-center flex-col px-10 gap-3'>
                <h1 className="text-5xl">Scrape Data</h1>
                <p>The scraping engine is powered by Bright Data</p>
            </div>
        <ScrapeData />
        </section>
    </section>
  )
}

export default ScrapeDataLayout