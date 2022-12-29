import { Fragment } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'

export default function HeaderMenuModal(props) {
	return (
		<Transition.Root show={props.open} as={Fragment}>
			<Dialog as="div" className="relative z-[130]" onClose={props.setOpen}>
				<Transition.Child
				as={Fragment}
				enter="ease-in-out duration-500"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in-out duration-500"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>
				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pr-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="-translate-x-full"
								enterTo="-translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="-translate-x-0"
								leaveTo="-translate-x-full"
							>
								<Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
									<div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
										<div className="px-4 sm:px-6">
											<Dialog.Title className="text-lg font-medium text-gray-900">Panel title</Dialog.Title>
										</div>
										<div className="relative mt-6 flex-1 px-4 sm:px-6">
											{/* Replace with your content */}
											<div className="absolute inset-0 px-4 sm:px-6">
												<div className="h-full border-2 border-dashed border-gray-200" aria-hidden="true" />
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
