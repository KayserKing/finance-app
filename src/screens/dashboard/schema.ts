import * as yup from 'yup';

export const changePasswordSchema = yup.object({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: yup
        .string()
        .required("New password is required")
        .min(8, "New password must be at least 8 characters")
        .notOneOf([yup.ref("currentPassword")], "New password cannot be the same as current password"),
    confirmNewPassword: yup
        .string()
        .required("Please confirm your new password")
        .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

export type ChangePasswordForm = yup.InferType<typeof changePasswordSchema>;