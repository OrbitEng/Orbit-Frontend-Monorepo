import { Transition } from "@headlessui/react"
import { Fragment } from "react"

export function NavBar(props){
    return (
        <Transition
        className="flex justify-self-center my-auto align-middle justify-center"
        appear={true}
        show={true}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <nav className="relative flex flex-row align-middle gap-10 text-lg justify-self-center justify-evenly">
            <button className="relative bg-transparent font-bold text-[#BBBBBB] transition hover:scale-105">Home</button>
            <button className="relative bg-transparent font-bold text-[#606060] transition hover:scale-105">Explore</button>
            <button className="relative bg-transparent font-bold text-[#606060] transition hover:scale-105">Learn</button>
            <button className="relative bg-transparent font-bold text-[#606060] transition hover:scale-105">Referral</button>
        </nav>
    </Transition>
    )
}