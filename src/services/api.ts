
import { ACCESS_TOKEN_COOKIE } from '@/utils';
import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

class ApiService {
    private BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    private axiosInstance: AxiosInstance;
  
    constructor() {
      this.axiosInstance = axios.create({
        baseURL: this.BASE_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      this.axiosInstance.interceptors.request.use((config:any) => {
        if (config.skipAuth) return config;
      
        const token = typeof window !== "undefined" ? Cookies.get(ACCESS_TOKEN_COOKIE) : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      
        return config;
      });            
    }
  
    private makeUrl = (resource: string) => {
      return '/api/' + resource;
    };
  
    get = (resource: string, config?: AxiosRequestConfig) => {
      return this.axiosInstance.get(this.makeUrl(resource), config);
    };
  
    post = (resource: string, payload?: object, config?: AxiosRequestConfig & { skipAuth?: boolean }) => {
      return this.axiosInstance.post(this.makeUrl(resource), payload, config);
    };    
  
    put = (resource: string, payload?: object, config?: AxiosRequestConfig) => {
      return this.axiosInstance.put(this.makeUrl(resource), payload, config);
    };
  
    patch = (resource: string, payload?: object, config?: AxiosRequestConfig) => {
      return this.axiosInstance.patch(this.makeUrl(resource), payload, config);
    };
  
    delete = (resource: string, config?: AxiosRequestConfig) => {
      return this.axiosInstance.delete(this.makeUrl(resource), config);
    };
  }
  

export default ApiService;