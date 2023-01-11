import Image from 'next/image';
import Link from 'next/link';

import OrbitLogo from '../public/OrbitLogos/OrbitFullLogo.png';
import discordIcon from "../public/Icons/discordMarkWhite.svg"
import instagramIcon from "../public/Icons/instagramGlyphWhite.svg";
import twitterIcon from "../public/Icons/twitterMarkWhite.svg";

export function MainFooter(){
    return (
        <footer className="max-w-7xl bg-transparent text-[#B1B1B1] sm:mx-auto mx-4 relative border-t-[1px] border-white border-opacity-20 py-8">
            <nav className="flex flex-row h-full align-center">
                <div className='flex w-1/5 justify-start flex-col'>
                    <div className='relative h-10'>
                        <Image
                            src={OrbitLogo}
                            layout="fill"
                            alt="The Name and Logo for the Orbit market"
                            objectFit="contain"
                            loading="lazy"
                        />
                    </div>
                </div>
                <div className="mx-auto my-auto flex flex-row justify-center md:gap-x-7 gap-x-3 text-[#838383] sm:text-sm text-xs font-mono">
                    <Link href="/terms">Terms</Link>
                    <Link href="/privacy">Privacy</Link>
                    <Link href="/cookies">Cookies</Link>
                </div>
                <div className="flex w-1/5 gap-x-2 justify-center my-auto">
                    <div className="flex flex-shrink-0 rounded-full border-white border-[1.5px] border-opacity-20 sm:h-9 sm:w-9 w-6 h-6">
                        <div className="relative flex mx-auto my-auto h-[14px] w-[14px] sm:h-[18px] sm:w-[18px]">
                            <Image 
                                src={discordIcon}
                                layout="fill"
                            />
                        </div>
                    </div>
                    <div className="flex flex-shrink-0 rounded-full border-white border-[1.5px] border-opacity-20 sm:h-9 sm:w-9 w-6 h-6">
                        <div className="relative flex mx-auto my-auto h-[14px] w-[14px] sm:h-[18px] sm:w-[18px]">
                            <Image 
                                src={instagramIcon}
                                layout="fill"
                            />
                        </div>
                    </div>
                    <div className="flex flex-shrink-0 rounded-full border-white border-[1.5px] border-opacity-20 sm:h-9 sm:w-9 w-6 h-6">
                        <div className="relative flex mx-auto my-auto h-[14px] w-[14px] sm:h-[18px] sm:w-[18px]">
                            <Image 
                                src={twitterIcon}
                                layout="fill"
                            />
                        </div>
                    </div>
                </div>
            </nav>
        </footer>
    )
}