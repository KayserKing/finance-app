import ApiService from '../api';
import { TNotesPayload } from './types';

class DashboardService extends ApiService {
    notes = (payload:TNotesPayload) => {
        return this.post(`notes`, payload);
    };

    getNotes = () => {
        return this.get('notes')
    }
}

const dashboardService = new DashboardService();

export default dashboardService;
