'use client'
import { Button, TextInput, Topic } from "@/components"
import { useForm } from "react-hook-form";
import { customerSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";

type FormData = {
    customerName: string;
    mobileNumber: string;
    mobileAltNumber: string;
};

const AddCustomer = () => {
    const { register, handleSubmit, trigger, formState:{errors} } = useForm<FormData>({
        resolver: yupResolver(customerSchema)
    });
    const onSubmit = (data: FormData) => {
        console.log('data', data);
    }
    return <div>
        <Topic title="ADD CUSTOMER" />
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
                <TextInput trigger={trigger} name={'customerName'} placeholder="Enter Customer Name" register={register} type="text" className="w-full" />
                {errors.customerName && (
                    <p className="text-red-500 text-sm">{errors.customerName.message}</p>
                )}
            </div>
            <div>
                <TextInput trigger={trigger} name={'mobileNumber'} placeholder="Enter Mobile Number" register={register} type="text" className="w-full" />
                {errors.mobileNumber && (
                    <p className="text-red-500 text-sm">{errors.mobileNumber.message}</p>
                )}
            </div>
            <div>
                <TextInput trigger={trigger} name={'mobileAltNumber'} placeholder="Enter Alt Mobile Number (Optional)" register={register} type="text" />
                {errors.mobileAltNumber && (
                    <p className="text-red-500 text-sm">{errors.mobileAltNumber.message}</p>
                )}
            </div>
            <div className="sm:text-right">
            <Button name="ADD" type="submit" className="w-full sm:w-24" />
            </div>
        </form>
    </div>
}

export default AddCustomer