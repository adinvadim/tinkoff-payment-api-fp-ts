import axios, { AxiosInstance } from 'axios';

export const initRequest = (): AxiosInstance => {
  const request = axios.create({
    baseURL: 'https://securepay.tinkoff.ru/v2/',
  });

  return request;
};
