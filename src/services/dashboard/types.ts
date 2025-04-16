export interface TNotesPayload {
    content: string;
    noteId: string;
}

export interface TCreateCustomerPayload {
    name: string;
    mobileNumber: string
    altMobileNumber?: string
}

export interface TCreateLoanPayload {
    customerName: string,
    loanAmount: number,
    loanStartDate: string,
    transactionType: string,
    paymentType: string
}