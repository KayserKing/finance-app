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


export const transactionSchema = yup.object().shape({
    customerName: yup.string().required('Customer name is required'),
    amount: yup
        .number()
        .typeError('Amount must be a number')
        .required('Amount is required')
        .positive('Amount must be greater than 0'),
    date: yup.string().required('Date is required'),
    transactionType: yup.string().required('Transaction type is required'),
    paymentType: yup.string().required('Payment type is required'),
});

export const customerSchema = yup.object().shape({
    customerName: yup
        .string()
        .required('Customer name is required'),
    mobileNumber: yup
        .string()
        .required('Mobile number is required')
        .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
    // mobileAltNumber: yup
    //     .string()
    //     .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit alternate number'),
});

export type CustomerFormData = yup.InferType<typeof customerSchema>;

export interface ErrorResponse {
    response: {
        data: {
            message: string;
        };
    };
}
  
