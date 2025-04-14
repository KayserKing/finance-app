import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  customerId: mongoose.Types.ObjectId;
  loanId: mongoose.Types.ObjectId;
  paymentTier: 'HIGH' | 'LOW';
  amount: number;
  date: Date;
  referenceId?: string;
}

const PaymentSchema: Schema = new Schema(
  {
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Customer', 
        required: true 
    },
    loanId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Loan', required: true 
    },
    paymentTier: {
      type: String,
      enum: ['HIGH', 'LOW'],
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, required: true }
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
