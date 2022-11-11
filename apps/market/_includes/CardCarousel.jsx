import { useRef } from 'react'
import { Rerousel } from 'rerousel'
import { BetaCard } from '@includes/components/cards/LargeCards'
import { Transition } from '@headlessui/react';

export function HomeBanner(props) {
    //@ts-ignore
	const [ref, setRef] = useRef(undefined);

    return(
        <div className="w-full max-w-5xl h-auto container content-center align-middle mx-auto my-12" >
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
                <BetaCard />
            </Transition>
        </div>
    )
}