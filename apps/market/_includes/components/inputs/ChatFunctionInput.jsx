import Image from "next/image";
import { TrashIcon, PaperClipIcon, CloudArrowUpIcon, TagIcon } from "@heroicons/react/24/outline";
import { useCallback, useContext, useEffect, useState } from "react";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import {CommissionRequestModal, ChatUploadPreviewModal} from "@includes/components/chat/ChatTxModals";
import { PhysicalFunctionalities, DigitalFunctionalities, CommissionFunctionalities } from "@functionalities/Transactions";

export function ChatFunctionInput(props){

    const {CommitPreview, ProposeRate, AcceptRate, SeePreview,
        UploadProductFile: UploadProductFileCommission, 
        UpdateStatusToShipping: UpdateStatusToShippingCommission, 
        CommitSubkeys: CommitSubkeysCommission, 
        ChooseBlocks: ChooseBlocksCommission, 
        DecryptImage: DecryptImageCommission, 
        } = CommissionFunctionalities();

	const {
		UpdateStatusToShipping: UpdateStatusToShippingDigital,
		UploadProductFile: UploadProductFileDigital,
		CommitSubkeys: CommitSubkeysDigital,
		SellerAcceptTransaction: SellerAcceptTransactionDigital,
		ChooseBlocks: ChooseBlocksDigital,
		DecryptImage: DecryptImageDigital,
	} = DigitalFunctionalities();

	const {
		OpenDispute,
		CloseDisputeSol,
		CloseDisputeSpl
	} = PhysicalFunctionalities();


    const {matrixClient} = useContext(MatrixClientCtx);
    const [openRequestModal, setOpenRequestModal] = useState(false);
    const [openUploadPreviewModal, setOpenUploadPreviewModal] = useState(false)
    const [functionalities, setFunctionalities] = useState();


    const submitReview = useCallback(()=>{
        
    },[]);

    const attachPreview = useCallback(()=>{
        
    },[]);

    const submitFinal = useCallback(()=>{
        
    },[]);

    useEffect(()=>{
        switch(props.txtype){
            case "digital":
                setFunctionalities({
                    CommitPreview, ProposeRate, AcceptRate, SeePreview,
                    UploadProductFile: UploadProductFileCommission,
                    UpdateStatusToShipping: UpdateStatusToShippingCommission,
                    CommitSubkeys: CommitSubkeysCommission,
                    ChooseBlocks: ChooseBlocksCommission,
                    DecryptImag: DecryptImageCommission
                })
                break;
            case "physical":
                setFunctionalities({
                    UpdateStatusToShipping: UpdateStatusToShippingDigital,
                    UploadProductFile: UploadProductFileDigital,
                    CommitSubkeys: CommitSubkeysDigital,
                    SellerAcceptTransaction: SellerAcceptTransactionDigital,
                    ChooseBlocks: ChooseBlocksDigital,
                    DecryptImage: DecryptImageDigital,
                })
                break;
            case "commission":
                setFunctionalities({
                    OpenDispute,
                    CloseDisputeSol,
                    CloseDisputeSpl
                })
                break;
            default:
                setFunctionalities()
                break;
        }
    },[props.txtype])

    return(
        <div className="flex flex-col  mx-3 bottom-0 mb-4 inset-x-0 p-3 bg-white bg-opacity-5 rounded-lg">
            <div className="flex flex-row w-full">
                <div className="flex flex-row justify-between w-24">
                    <PaperClipIcon className="h-5 w-5 text-[#949494]" onClick={open}/>
                    <div className="border-x border-[#4D4D4D]" />
                    <button className="flex" onClick={() => {setOpenUploadPreviewModal(true)}}>
                        <CloudArrowUpIcon className="h-5 w-5 text-[#949494]"/>
                    </button>
                    <button className="flex" onClick={() => {setOpenRequestModal(true)}}>
                        <TagIcon className="h-5 w-5 text-[#949494]"/>
                    </button>
                </div>
                
                <ChatUploadPreviewModal
                    open={openUploadPreviewModal}
                    setOpen={setOpenUploadPreviewModal}
                    txid={propstxid}
                />
                <CommissionRequestModal open={openRequestModal} setOpen={setOpenRequestModal}/>
            </div>
        </div>
    )
}