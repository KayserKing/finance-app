import mongoose, { Schema, Document } from 'mongoose';

export interface ILoan extends Document {
    loanAmount: number;
    loanStartDate: Date;
    loanEndDate: Date;
    dailyAmountToBePaid: number;
    active: boolean;
    customerId: mongoose.Types.ObjectId;
}

const LoanSchema: Schema = new Schema(
    {
        loanAmount: {
            type: Number,
            required: true,
        },
        loanStartDate: {
            type: Date,
            required: true,
        },
        loanEndDate: {
            type: Date,
            required: true,
        },
        dailyAmountToBePaid: {
            type: Number,
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Loan = mongoose.models.Loan || mongoose.model<ILoan>('Loan', LoanSchema);

export default Loan;
