import { Button } from "../buttons";

interface TPopUp {
    description: string
    handleCancel: () => void;
    handleProceed: () => void;
}

const PopUp = ({ description, handleCancel, handleProceed }: TPopUp) => {

    return <div className="fixed w-screen h-screen z-50 top-0 left-0 bg-[#004aad]/10 flex justify-center items-center">
        <div className="bg-white p-4 w-[90%] sm:w-[300px]">
            <p className="text-center">{description}</p>
            <div className="flex flex-row gap-2 mt-4">
            <Button name="Cancel" type="button" handleClick={handleCancel} className="p-2 w-full bg-white !text-[#004aad] border-[0.5px] border[#004aad]" />
            <Button name="Proceed" type="button" handleClick={handleProceed} className="px-2 w-full" />
            </div>
        </div>
    </div>
}

export default PopUp;