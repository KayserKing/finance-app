import ApiService from '../api';
import { TCreateCustomerPayload, TCreateLoanPayload, TNotesPayload } from './types';

class DashboardService extends ApiService {
    notes = (payload:TNotesPayload) => {
        return this.post(`notes`, payload);
    };

    getNotes = () => {
        return this.get('notes')
    }

    createCustomer = (payload:TCreateCustomerPayload) => {
        return this.post('customer/create', payload)
    }

    getCustomers = () => {
        return this.get('customer')
    }

    createLoan = (payload:TCreateLoanPayload) => {
        return this.post('loan/create', payload)
    }

    createTransaction = (payload: TCreateLoanPayload) => {
        return this.post(`transactions/create`, payload)
    }
}

const dashboardService = new DashboardService();

export default dashboardService;
