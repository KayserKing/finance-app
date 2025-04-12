'use client'
import { Button, TextInput, Topic } from "@/components";
import { useAuthService } from "@/services";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ChangePasswordForm, changePasswordSchema } from "./schema";
import { ACCESS_TOKEN_COOKIE } from "@/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const ChangePassword = () => {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, } = useForm<ChangePasswordForm>({
        resolver: yupResolver(changePasswordSchema),
    });

    const {useChangePassword} = useAuthService()
    const {mutate:changePasswordMutate} = useChangePassword({
        onSuccess: () => {
            toast.success('Password updated successfully, please login again.');
            Cookies.remove(ACCESS_TOKEN_COOKIE);
            router.push('/login');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
        }
    })

    const onSubmit = (data: ChangePasswordForm) => changePasswordMutate(data);

    return <div>
        <Topic title="CHANGE PASSWORD" />
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-[280px] max-sm:w-[100%] flex flex-col gap-4">
                <div>
                    <TextInput type="password" name="currentPassword" placeholder="Enter your current password" register={register} />
                    {errors.currentPassword && (
                        <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
                    )}
                </div>
                <div>
                    <TextInput type="password" name="newPassword" placeholder="Enter your new password" register={register} />
                    {errors.newPassword && (
                        <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                    )}
                </div>
                <div>
                    <TextInput type="password" name="confirmNewPassword" placeholder="Confirm new password" register={register} />
                    {errors.confirmNewPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmNewPassword.message}</p>
                    )}
                </div>
            </div>
            <Button name="CHANGE PASSWORD" type="submit" className="px-4 mt-4 max-sm:w-[100%]" />
        </form>
    </div>
}

export default ChangePassword;