import { Transition } from "@headlessui/react"
import { Fragment } from "react"

export function NavBar(props){
    return (
        <Transition
        className="flex top-0 z-10 justify-self-center align-middle justify-center mx-auto w-full my-auto"
        appear={true}
        show={true}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <nav className="relative hidden w-1/3 md:flex flex-row align-middle gap-10 z-10 text-sm lg:text-lg mx-auto justify-evenly my-auto">
            <button className="relative bg-transparent font-bold text-[#BBBBBB] transition hover:scale-105">Home</button>
            <button className="relative bg-transparent font-bold text-[#606060] transition hover:scale-105">Explore</button>
            <button className="relative bg-transparent font-bold text-[#606060] transition hover:scale-105">Learn</button>
            <button className="relative bg-transparent font-bold text-[#606060] transition hover:scale-105">Referral</button>
        </nav>
    </Transition>
    )
}