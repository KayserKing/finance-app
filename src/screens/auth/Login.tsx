'use client';

import { Button, TextInput } from "@/components";
import { useAuthService } from "@/services";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from 'js-cookie'
import { ACCESS_TOKEN_COOKIE } from "@/utils";

type FormData = {
    username: string;
    password: string;
};

interface LoginResponse {
    data: {
        token: string;
    };
}

interface ErrorResponse {
    response: {
        data: {
            message: string;
        };
    };
}

const Login = () => {
    const { register, handleSubmit } = useForm<FormData>();
    const router = useRouter();

    const { useLogin } = useAuthService();
    const { mutate: loginMutate } = useLogin({
        onSuccess: (data: unknown) => {
            const loginData = data as LoginResponse;

            if (loginData?.data?.token) {
                Cookies.set(ACCESS_TOKEN_COOKIE, loginData?.data?.token);
            }
            router.push('/');
        },
        onError: (err: unknown) => {
            const error = err as ErrorResponse;

            toast.error(error?.response?.data?.message || 'Login failed. Please try again.');
        }
    });

    const onSubmit = (data: FormData) => loginMutate(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full h-screen flex flex-col items-center justify-center space-y-4">
            <div className="font-bold text-xl">Finance App</div>
            <div className="w-[280px] max-sm:w-[80%] flex flex-col gap-4">
                <TextInput type="text" name="username" placeholder="Enter your username" register={register} />
                <TextInput type="password" name="password" placeholder="Enter your password" register={register} />
                <Button name="Login" type="submit" />
            </div>
        </form>
    );
};

export default Login;
