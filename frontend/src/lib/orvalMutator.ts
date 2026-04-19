import type { AxiosRequestConfig } from 'axios';
import { network } from './axios';

/**
 * Custom Orval mutator that routes all generated API calls through
 * the shared `network` Axios instance (base URL, credentials, interceptors).
 */
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return network<T>(config).then(({ data }) => data);
};

export default customInstance;
