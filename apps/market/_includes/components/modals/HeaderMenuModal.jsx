import { Fragment } from 'react'
import { Bars3CenterLeftIcon } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image';
import OrbitLogoFull from "../../../public/OrbitLogos/OrbitFullLogo.png"

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
										<div className="px-4 sm:px-6">
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
										<div className="relative mt-6 flex-1 px-4 sm:px-6">
											{/* Replace with your content */}
											<div className="absolute inset-0 px-4 sm:px-6">
												<div className="h-full flex border-2 border-dashed border-gray-200" aria-hidden="true">
													<div className="flex text-center my-auto mx-auto text-3xl font-bold text-white">placeholder</div>
												</div>
											</div>
											{/* /End replace */}
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
