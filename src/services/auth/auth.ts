import ApiService from '../api';
import { TChangePassword, TLoginPayload } from './types';

class AuthService extends ApiService {
    login = (payload: TLoginPayload) => {
        return this.post(`login`, payload, { skipAuth: true });
    };

    changePassword = (payload: TChangePassword) => {
        return this.post(`change-password`, payload);
    }
}

const authService = new AuthService();

export default authService;
