import React from 'react'

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const Image = ({ images }) => {

    const randomImages = [
        "/randomImages/random1.jpg",
        "/randomImages/random2.jpg",
        "/randomImages/random3.jpg",
        "/randomImages/random4.jpg",
        "/randomImages/random5.jpg",
    ]

    shuffleArray(randomImages);

    const getRandomImage = (index) => {
        if (images && images[index]) {
            return images[index];
        } else {
            const randomIndex = index % randomImages.length;
            return randomImages[randomIndex];
        }
    }

    return (
        <div className='p-5'>
            {
                images && <>
                    <div className='grid grid-cols-12 gap-4 lg:gap-6'>
                        <div className='col-span-12 xl:col-span-4'>
                            <div className="grid grid-cols-12 gap-4 lg:gap-6">
                                <div className="col-span-12 sm:col-span-6 xl:col-span-12">
                                    <a href="/img/tour-details-img-1.jpg" className='link property-gallery'>
                                        <img src={getRandomImage(0)} alt="image" width={610} height={288} className='w-full rounded-2xl' style={{ color: 'transparent' }}></img>
                                    </a>
                                </div>
                                <div className="col-span-12 sm:col-span-6 xl:col-span-12 relative">
                                    <a href="/img/tour-details-img-2.jpg" className='link property-gallery'>
                                        <img src={getRandomImage(1)} alt="image" width={610} height={288} className='w-full rounded-2xl' style={{ color: 'transparent' }}></img>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-6 xl:col-span-4">
                            <a href="/img/tour-details-img-3.jpg" className='link block property-gallery h-full overflow-hidden'>
                                <img decoding="async" src={getRandomImage(2)} alt="image" width={610} height={600} className='w-full rounded-2xl h-full' style={{ color: 'transparent' }}></img>
                            </a>
                        </div>
                        <div className="col-span-12 md:col-span-6 xl:col-span-4">
                            <div className="grid grid-cols-12 gap-4 lg:gap-6 h-full">
                                <div className="col-span-12 h-full">
                                    <a href="/img/tour-details-img-4.jpg" className='link property-gallery h-full'>
                                        <img decoding="async" src={getRandomImage(3)} alt="image" width={610} height={288} className='w-full rounded-2xl h-full' style={{ color: 'transparent' }}></img>
                                    </a>
                                </div>
                                <div className="col-span-12 sm:col-span-6">
                                    <a href="/img/tour-details-img-5.jpg" className='link property-gallery'>
                                        <img decoding="async" src={getRandomImage(4)} alt="image" width={610} height={600} className='w-full rounded-2xl h-full' style={{ color: 'transparent' }}></img>
                                    </a>
                                </div>
                                <div className="col-span-12 sm:col-span-6">
                                    <a href="/img/tour-details-img-6.jpg" className='link property-gallery'>
                                        <img decoding="async" src={getRandomImage(5)} alt="image" width={610} height={288} className='w-full rounded-2xl h-full' style={{ color: 'transparent' }}></img>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default Image