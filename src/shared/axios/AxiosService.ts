import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

const axiosService: AxiosInstance = axios.create({
  headers: {
    common: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
  baseURL: baseUrl,
});

axiosService.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError) => {
    console.error('ERROR', error);
    return Promise.reject(error);
  },
);

export { axiosService };
