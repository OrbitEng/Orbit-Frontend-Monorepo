import { useRef } from 'react'
import { Transition } from '@headlessui/react';
import Image from 'next/image';

export function HomeBanner(props) {
    //@ts-ignore
	const [ref, setRef] = useRef(undefined);

    return(
        <div className="w-full max-w-5xl h-auto container content-center align-middle mx-auto mt-36 mb-0" >
            <Transition
                appear={true}
                show={true}
                enter="transition transform transition-opacity transition-transform transition-all duration-1000 ease-in-out"
                enterFrom="opacity-0 -translate-y-10 "
                enterTo="opacity-100 -translate-y-0"
                leave="transform duration-200 transition ease-in-out"
                leaveFrom="opacity-100 rotate-0 scale-100 "
                leaveTo="opacity-0 scale-95 "
            >
                <div className="relative flex h-36">
                    <Image 
                        src="/LargeOrbitLogo.png"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            </Transition>
        </div>
    )
}