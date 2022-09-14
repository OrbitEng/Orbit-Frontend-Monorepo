import { Transition } from "@headlessui/react"
import { Fragment } from "react"

export function NavBar(props){
    return (
        <Transition
        appear={true}
        show={true}
        as={Fragment}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <nav className="flex flex-row align-middle gap-10 text-lg justify-self-center">
            <button className="bg-transparent font-bold text-[#BBBBBB]">Home</button>
            <button className="bg-transparent font-bold text-[#606060]">Explore</button>
            <button className="bg-transparent font-bold text-[#606060]">Learn</button>
            <button className="bg-transparent font-bold text-[#606060]">Referral</button>
        </nav>
    </Transition>
    )
}