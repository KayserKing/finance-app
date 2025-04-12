import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { TChangePassword, TLoginPayload } from "./types";
import { CHANGE_PASSWORD, LOGIN } from "@/utils";
import authService from "./auth";

type UseLoginOptions = UseMutationOptions<unknown, Error, TLoginPayload>;
type UseChangePasswordOptions = UseMutationOptions<unknown, Error, TChangePassword>;

const useAuth = () => {
  const useLogin = (options?: UseLoginOptions) =>
    useMutation({
      mutationKey: [LOGIN],
      mutationFn: (payload: TLoginPayload) => authService.login(payload),
      ...options,
    });
  
    const useChangePassword = (options?: UseChangePasswordOptions) =>
      useMutation({
        mutationKey: [CHANGE_PASSWORD],
        mutationFn: (payload: TChangePassword) => authService.changePassword(payload),
        ...options,
      });

  return {
    useLogin,
    useChangePassword
  };
};

export default useAuth;