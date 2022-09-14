export function NavBar(props){
    return (
        <nav className="flex flex-row align-middle gap-10 text-lg justify-self-center">
            <button className="bg-transparent font-bold text-[#BBBBBB]">Home</button>
            <button className="bg-transparent font-bold text-[#606060]">Explore</button>
            <button className="bg-transparent font-bold text-[#606060]">Learn</button>
            <button className="bg-transparent font-bold text-[#606060]">Referral</button>
        </nav>
    )
}