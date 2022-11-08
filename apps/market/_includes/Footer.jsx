import OrbitLogo from '../public/OrbitLogo.png';
import Image from 'next/image';
import Link from 'next/link';

export function MainFooter(){
    return (
        <footer className="max-w-7xl bg-transparent text-[#B1B1B1] mx-auto relative">
            <nav className="flex flex-row justify-center h-full pb-12 align-center">
                <div className='w-1/5 justify-center hidden sm:flex flex-col align-center'>
                    <div className='relative w-full h-14'>
                        <Image
                            src={OrbitLogo}
                            layout="fill"
                            alt="The Name and Logo for the Orbit market"
                            objectFit="contain"
                            loading="lazy"
                        />
                    </div>
                </div>
                <div className='grid grid-col grow justify-center text-center align-top mb-auto'>
                    <div className="text-2xl font-bold mb-5 align-top">
                        Products
                    </div>
                    <div className='flex flex-col gap-y-3 text-[#8A8A8A] align-top'>
                        <Link href={"/"}>Home</Link>
                        <Link href={"/explore/physical"}>Physical</Link>
                        <Link href={"/explore/digital"}>Digital</Link>
                        <Link href={"/explore/commissions"}>Commissions</Link>
                    </div>
                </div>
                <div className='grid grid-col grow justify-center text-center align-top mb-auto'>
                    <div className="text-2xl font-bold mb-5 align-top">
                        Learn
                    </div>
                    <div className='flex flex-col gap-y-3 text-[#8A8A8A] align-top'>
                        <Link href={"/blog"}>Blog</Link>
                        <Link href={"/docs"}>Docs</Link>
                    </div>
                </div>
                <div className='grid grid-col grow justify-center text-center align-top mb-auto'>
                    <div className="text-2xl font-bold mb-5 align-top">
                        Marketplace
                    </div>
                    <div className='flex flex-col gap-y-3 text-[#8A8A8A] align-top'>
                        <Link href={"/"}>Dumb</Link>
                        <Link href={"/"}>Stuff</Link>
                    </div>
                </div>
                <div className='grid grid-col justify-center grow text-center'>
                    <div className="text-2xl font-bold">
                        Community
                    </div>
                    <div className='flex flex-row text-[#8A8A8A] justify-center -mt-12 gap-x-2'>
                        <Image
                            src="/discordicon.png"
                            layout='fixed'
                            width={36}
                            height={36}
                            loading="lazy"
                        />
                        <Image
                            src="/mediumicon.png"
                            layout='fixed'
                            width={36}
                            height={36}
                            loading="lazy"
                        />
                    </div>
                </div>
            </nav>
        </footer>
    )
}