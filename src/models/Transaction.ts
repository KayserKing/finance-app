import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    amount: number;
    customerId: mongoose.Types.ObjectId;
    loanId: mongoose.Types.ObjectId;
    transactionType: 'RECEIVE' | 'SEND';
    date: Date;
    referenceId?: string;
}

const TransactionSchema: Schema = new Schema(
    {
        amount: { 
            type: Number, 
            required: true 
        },
        customerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Customer', 
            required: true 
        },
        loanId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Loan', 
            required: true 
        },
        transactionType: {
            type: String,
            enum: ['RECEIVE', 'SEND'],
            required: true,
        },
        date: { 
            type: Date, required: true 
        }
    },
    {
        timestamps: true,
    }
);

const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
