import OrbitLogo from '../public/OrbitLogo.png';
import Image from 'next/image';

export function MarketFooter(){
    return (
        <div className="sticky bg-transparent text-[#B1B1B1]">
            <div className="flex flex-row justify-center h-full pb-12 align-center">
                <div className='w-1/5 justify-center flex flex-col align-center'>
                    <div className='relative w-full h-14'>
                        <Image
                            src={OrbitLogo}
                            layout="fill"
                            alt="The Name and Logo for the Orbit market"
                            objectFit="contain"
                            priority={true}
                        />
                    </div>
                </div>
                <div className='grid grid-col grow justify-center text-center'>
                    <div className="text-2xl font-bold">
                        Products
                    </div>
                    <div className='flex flex-col text-[#8A8A8A]'>
                        <div>Physical</div>
                        <div>Marketplace</div>
                        <div>Digital</div>
                    </div>
                </div>
                <div className='grid grid-col grow justify-center text-center'>
                    <div className="text-2xl font-bold">
                        Learn
                    </div>
                    <div className='flex flex-col text-[#8A8A8A]'>
                        <div>Blog</div>
                        <div>Docs</div>
                    </div>
                </div>
                <div className='grid grid-col grow justify-center text-center'>
                    <div className="text-2xl font-bold">
                        Marketplace
                    </div>
                    <div className='flex flex-col text-[#8A8A8A]'>
                        <div>Dumb</div>
                        <div>Stuff</div>
                    </div>
                </div>
                <div className='grid grid-col grow justify-center text-center'>
                    <div className="text-2xl font-bold">
                        Community
                    </div>
                    <div className='flex flex-row text-[#8A8A8A]'>

                    </div>
                </div>
            </div>
        </div>
    )
}