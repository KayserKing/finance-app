import ApiService from '../api';
import { TCreateCustomerPayload, TCreateLoanPayload, TDownloadReportPayload, TNotesPayload } from './types';

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

    getCustomers = (searchParams:string | null) => {
        return this.get(`customer?${searchParams}`)
    }

    getTransactionsSummary = () => {
        return this.get(`transactions/summary`)
    }

    getCustomerById = (id:string) => {
        return this.get(`customer/${id}`)
    }

    createLoan = (payload:TCreateLoanPayload) => {
        return this.post('loan/create', payload)
    }

    createTransaction = (payload: TCreateLoanPayload) => {
        return this.post(`transactions/create`, payload)
    }

    getTransactions = (searchParams: string) => {
        return this.get(`transactions?${searchParams}`)
    }

    downloadReport = (payload: TDownloadReportPayload) => {
        return this.post(`reports/download`, payload)
    }

    deleteReport = () => {
        return this.post(`reports/delete`)
    }

    deleteCustomer = (id: string) => {
        return this.delete(`customer/${id}`);
    }
}

const dashboardService = new DashboardService();

export default dashboardService;
