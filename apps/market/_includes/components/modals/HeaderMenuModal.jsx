import { Fragment } from 'react'
import { Bars3CenterLeftIcon, ComputerDesktopIcon, HomeIcon, MagnifyingGlassIcon, TruckIcon, UsersIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image';
import OrbitLogoFull from "../../../public/OrbitLogos/OrbitFullLogo.png"
import { EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';

export default function HeaderMenuModal(props) {
	return (
		<Transition.Root show={props.open} as={Fragment}>
			<Dialog as="div" className="relative z-[130]" onClose={props.setOpen}>
				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="-translate-x-full"
								enterTo="-translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="-translate-x-0"
								leaveTo="-translate-x-full"
							>
								<Dialog.Panel className="pointer-events-auto relative w-screen max-w-sm mr-20">
									<div className="flex h-full flex-col overflow-y-scroll bg-[#0E0D15F2] py-6 shadow-xl backdrop-blur-[51px]">
										<div className="px-8">
											<Dialog.Title className="text-lg font-medium text-gray-900">
												<div className="relative flex py-auto w-52 cursor-pointer justify-start">
													<button
														className="text-white sm:hidden flex mr-1"
														onClick={(e) => {
															e.preventDefault();
															props.setOpen(false);
														}}
													>
														<Bars3CenterLeftIcon className="text-white h-7 w-7 my-auto"/>
													</button>
													<button 
														className="relative flex flex-shrink-0 p-0 m-0 w-24 sm:w-32 h-6 sm:h-8 my-auto"
														onClick={(e) =>  {
															e.preventDefault()
															router.push("/")
														}}
													>
														<Image
															src={OrbitLogoFull}
															layout="fill"
															alt="The Name and Logo for the Orbit market"
															objectFit="contain"
															priority={true}
														/>
													</button>
												</div>
											</Dialog.Title>
										</div>
										<div className="relative mt-6 flex-1 px-8">
											<div className="absolute inset-0 px-8">
												<div className="h-full flex mt-4" aria-hidden="true">
													<div className="flex flex-col w-full gap-y-6">
														<button className="flex border-t-[0.5px] border-[#474747] home-button-bg text-[#D3D3D3] font-bold w-full rounded-[13px] h-[45px] px-2">
															<span className="flex flex-row gap-x-3 my-auto">
																<HomeIcon className="h-[24px] w-[24px] my-auto" />
																<span className="text-xl my-auto align-middle">Home</span>
															</span>
														</button>
														<button className="bg-transparent text-[#7C7C7C] w-full rounded-[13px] py-[6px] px-2">
															<span className="flex flex-row gap-x-3 my-auto" >
																<MagnifyingGlassIcon className="h-[24px] w-[24px] my-auto"/>
																<span className="my-auto text-xl">Explore</span>
															</span>
														</button>
														<button className="bg-transparent text-[#7C7C7C] w-full rounded-[13px] py-[6px] px-2">
															<span className="flex flex-row gap-x-3 my-auto" >
																<EnvelopeIcon className="h-[24px] w-[24px] my-auto"/>
																<span className="my-auto text-xl">Messages</span>
															</span>
														</button>
														<button className="bg-transparent text-[#7C7C7C] w-full rounded-[13px] py-[6px] px-2">
															<span className="flex flex-row gap-x-3 my-auto" >
																<UserIcon className="h-[24px] w-[24px] my-auto"/>
																<span className="my-auto text-xl">Profile</span>
															</span>
														</button>
													</div>
													<div className="absolute bottom-0 inset-x-0 grid grid-cols-2 grid-rows-2 w-full gap-2 px-4 text-[#A9A9A9] text-sm">
														<div className="rounded-md bg-[#24222E] h-14 flex justify-start px-4"> 
															<span className="flex my-auto gap-x-2">
																<UsersIcon className="h-[30px] w-[30px] my-auto" />
																<span className="my-auto">Local</span>
															</span>
														</div>
														<div className="rounded-md bg-[#24222E] h-14 flex justify-start px-4">
															<span className="flex my-auto gap-x-2">
																<TruckIcon className="h-[30px] w-[30px] my-auto" />
																<span className="my-auto">Shipped</span>
															</span>
														</div>
														<div className="rounded-md bg-[#24222E] h-14 flex justify-start px-4">
															<span className="flex my-auto gap-x-2">
																<ComputerDesktopIcon className="h-[30px] w-[30px] my-auto" />
																<span className="my-auto">Digital</span>
															</span>
														</div>
														<div className="rounded-md bg-[#24222E] h-14 flex justify-start px-4">
															<span className="flex my-auto gap-x-2">
																<WrenchScrewdriverIcon className="h-[30px] w-[30px] my-auto" />
																<span className="my-auto">Jobs</span>
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
