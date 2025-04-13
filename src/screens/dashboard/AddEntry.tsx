'use client'
import { Button, DateInput, RadioInput, SearchDropdownInput, TextInput, Topic } from "@/components"
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { transactionSchema } from "./schema";

type FormData = {
    customerName: string;
    amount: number;
    date: string;
    transactionType: string;
};

const AddEntry = () => {
    const options = ['Apple', 'Banana', 'Cherry', 'Date', 'Grapes'];
    const today = new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Kolkata',
      });
    const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(transactionSchema),
        defaultValues: {
            transactionType: 'receive',
            date:today
        },
        mode: 'onChange'
    });
    const onSubmit = (data: FormData) => {
        console.log('data', data);
    }
    return <div>
        <Topic title="ADD ENTRY" />
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
                <SearchDropdownInput trigger={trigger} name={'customerName'} options={options} register={register} setValue={setValue} placeholder="Search Customer" />
                {errors.customerName && (
                    <p className="text-red-500 text-sm">{errors.customerName.message}</p>
                )}
            </div>
            <div>
                <TextInput name={'amount'} placeholder="Enter Amount" register={register} type="text" className="w-full" />
                {errors.amount && (
                    <p className="text-red-500 text-sm">{errors.amount.message}</p>
                )}
            </div>
            <div>

                <DateInput name={'date'} setValue={setValue} register={register} placeholder="Enter Date" />
                {errors.date && (
                    <p className="text-red-500 text-sm">{errors.date.message}</p>
                )}
            </div>
            <div>
                <RadioInput name={'transactionType'} register={register} />
                {errors.transactionType && (
                    <p className="text-red-500 text-sm">{errors.transactionType.message}</p>
                )}
            </div>
            <div className="sm:text-right">
                <Button name="ADD" type="submit" className="w-full sm:w-24" />
            </div>
        </form>
    </div>
}

export default AddEntry