import { useState, Fragment, useContext, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CommissionFunctionalities } from "@functionalities/Transactions";
import UserAccountCtx from "@contexts/UserAccountCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";


export function ProposeRateModal(props) {

	const [transaction, setTransaction] = useState(props.transactions[0]);
	const [rate, setRate] = useState(0);
    const {userAccount} = useContext(UserAccountCtx);
    const {ProposeRate} = CommissionFunctionalities();

    const SendProposal = useCallback(async ()=>{
		if(!(transaction && transaction.txid) || !userAccount || (transaction.data.lastRateOfferer.toString() == userAccount.address.toString())) return;
        await ProposeRate(transaction.txid, rate);
        props.setOpen(false);
    },[props, transaction, userAccount, ProposeRate, rate]);

	return(
		<Transition show={props.open} as={Fragment}>
			<Dialog as="div" className="fixed z-[260]" onClose={() => props.setOpen(false)}>
			<Transition.Child
				as={Fragment}
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="fixed inset-0 backdrop-blur" />
			</Transition.Child>
			<div className="fixed inset-0 overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4 text-center">
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-[200ms]"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<Dialog.Panel className={`w-[600px] transform rounded-2xl backdrop-blur bg-gradient-to-t from-[#32254EB3] to-[#26232CE6] border-t-[0.5px] border-[#474747] text-left align-middle shadow-xl transition-all duration-500`}>
						<div className="flex flex-col rounded-xl py-10 px-[4rem] w-full transition duration-700">
							<div className="top-0 left-0 flex flex-row pt-1 justify-center">
								<h1 className="text-3xl text-white font-bold">Propose a Rate</h1>
								<div className="flex-grow"/>
								<button
									type="button"
									className="rounded-full text-white hover:text-white p-1 border-[#5b5b5b] border-[1px] focus:outline-none"
									onClick={() => props.setOpen(false)}
								>
									<span className="sr-only">Close panel</span>
									<XMarkIcon className="h-6 w-6 text-[#e2e2e2]" aria-hidden="true" />
								</button>
							</div>

							<div className="w-full">
							<Listbox value={transaction.txid} onChange={setTransaction} id="availability">
									<div className="flex flex-col relative w-3/4 text-xl h-1/2 justify-end">
										<Listbox.Button className="w-full h-full rounded-lg justify-center">
											<div className='w-full bg-[#242424] rounded-lg overflow-hidden h-4/5 ring-1 ring-inset ring-blue-200'>
												{(transaction.txid && transaction.txid.toString()) || ""}
											</div>
										</Listbox.Button>
										<Listbox.Options className="w-full text-center absolute -bottom-8 transition rounded-b">
											{
												props.transactions.map(tx => (
													<Listbox.Option
														key={tx.txid}
														value = {tx}
														className="w-full bg-[#242424] rounded-lg overflow-hidden h-4/5 ring-1 ring-inset ring-blue-200"
													>
														{tx.txid.toString()}
													</Listbox.Option>
												))
											}
										</Listbox.Options>
									</div>
								</Listbox>
							</div>

							<div className="grid grid-cols-1 mt-8 border-[#545454] border-[1px] bg-[#131313] bg-opacity-[56%] h-[280px] rounded-xl text-white place-items-center">
                                <div className="w-4/5 h-4/5 flex flex-col justify-center border-dashed border-2 rounded-sm">
                                    <input
                                        className="px-3 pt-3 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E] rounded-lg grow"
                                        placeholder="0"
                                        type="number"
                                        min="0"
                                        max="100"
                                        id="rate"
                                        name="rate"
                                        value={rate}
                                        onChange={(e)=>{
                                            setRate(e.target.value)
                                        }}
                                    />
                                </div>

                                <div className="flex flex-row justify-center text-white my-4">
                                    <div>Project completion</div>
                                    <div className="flex-grow"/>
                                    <div className="text-sm">{transaction && transaction.closeRate.toString()}</div>
                                </div>

                                <div className="h-2 w-full bg-[#2F2F2F] rounded-full overflow-hidden">
                                    <div className="rounded-full w-[40%] overflow-hidden bg-gradient-to-r from-[#3375F4] to-[#98E6FF] via-[#4FAEF7] bg-clip-content h-full"></div>
                                </div>

                                <button
                                    className={"py-4 px-8 z-[120] flex flex-row justify-center bg-[#008C1F3c] rounded-full mt-8 w-fit mx-auto opacity-100"}
                                    onClick={SubmissionCallback}
                                >
                                    <span className="text-transparent bg-clip-text bg-gradient-to-t from-[#19B500] to-white font-bold flex flex-row my-auto">
                                        Send Rate
                                    </span>
                                </button>
                            </div>
						</div>
					</Dialog.Panel>
				</Transition.Child>
				</div>
			</div>
			</Dialog>
		</Transition>
	)
} 