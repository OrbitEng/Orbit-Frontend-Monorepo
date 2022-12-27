import Image from 'next/image';
import Link from 'next/link';

import OrbitLogo from '../public/OrbitLogos/OrbitFullLogo.png';
import discordIcon from "../public/Icons/discordMarkWhite.svg"
import instagramIcon from "../public/Icons/instagramGlyphWhite.svg";
import twitterIcon from "../public/Icons/twitterMarkWhite.svg";

export function MainFooter(){
    return (
        <footer className="max-w-7xl bg-transparent text-[#B1B1B1] mx-auto relative border-t-[1px] border-white border-opacity-20 py-8">
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
                <div className="mx-auto my-auto flex flex-row justify-center gap-x-7">
                    <Link href="/terms" className="text-[#838383] text-sm font-mono">Terms</Link>
                    <Link href="/privacy" className="text-[#838383] text-sm font-mono">Privacy</Link>
                    <Link href="/cookies" className="text-[#838383] text-sm font-mono">Cookies</Link>
                </div>
                <div className="flex w-1/5 justify-end pr-16 gap-x-2">
                    <div className="flex rounded-full border-white border-[1.5px] border-opacity-20 h-9 w-9">
                        <div className="relative flex mx-auto my-auto">
                            <Image 
                                src={discordIcon}
                                layout="fixed"
                                height={18}
                                width={18}
                            />
                        </div>
                    </div>
                    <div className="flex rounded-full border-white border-[1.5px] border-opacity-20 h-9 w-9">
                        <div className="relative flex mx-auto my-auto">
                            <Image 
                                src={instagramIcon}
                                layout="fixed"
                                height={18}
                                width={18}
                            />
                        </div>
                    </div>
                    <div className="flex rounded-full border-white border-[1.5px] border-opacity-20 h-9 w-9">
                        <div className="relative flex mx-auto my-auto">
                            <Image 
                                src={twitterIcon}
                                layout="fixed"
                                height={18}
                                width={18}
                            />
                        </div>
                    </div>
                </div>
            </nav>
        </footer>
    )
}