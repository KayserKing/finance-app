import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    mobileNumber: string;
    altMobileNumber?: string;
    loanId?: mongoose.Types.ObjectId;
    lastPaidDate?: Date;
    noOfUnpaidDays?: number;
    active?: boolean;
    amountPaid?: number;
}

const CustomerSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        mobileNumber: {
            type: String,
            required: true,
            trim: true,
        },
        altMobileNumber: {
            type: String,
            trim: true,
        },
        loanIds: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Loan' }],
            ref: 'Loan',
        },
        lastPaidDate: {
            type: Date,
        },
        noOfUnpaidDays: {
            type: Number,
        },
        active: {
            type: Boolean,
            default: true,
        },
        amountPaid: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
