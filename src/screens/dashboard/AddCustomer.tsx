'use client'
import { Button, TextInput, Topic } from "@/components"
import { useForm } from "react-hook-form";
import { customerSchema, ErrorResponse } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDashboardService } from "@/services";

type FormData = {
    customerName: string;
    mobileNumber: string;
    mobileAltNumber?: string;
};

const AddCustomer = () => {
    const router = useRouter();
    const { register, handleSubmit, trigger, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(customerSchema)
    });
    const { useCreateCustomer } = useDashboardService();
    const { mutate: createCustomerMutate } = useCreateCustomer({
        onSuccess: () => { 
            toast.success('Customer successfully created!')
            router.push('/add'); 
        },
        onError: (err: unknown) => {
            const error = err as ErrorResponse;
            toast.error(error?.response?.data?.message || 'Something went wrong. Please try again.');
        }
    })
    const onSubmit = (data: FormData) => {
        createCustomerMutate({
            name: data.customerName,
            mobileNumber: data.mobileNumber,
            altMobileNumber: data.mobileAltNumber || ''
        })
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
                <TextInput trigger={trigger} length={10} name={'mobileNumber'} placeholder="Enter Mobile Number" register={register} type="text" className="w-full" />
                {errors.mobileNumber && (
                    <p className="text-red-500 text-sm">{errors.mobileNumber.message}</p>
                )}
            </div>
            <div>
                <TextInput trigger={trigger} length={10} name={'mobileAltNumber'} placeholder="Enter Alt Mobile Number (Optional)" register={register} type="text" />
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