import axios from 'axios'
import { API_CONFIG } from '../config/constants'

export const createApiClient = (baseURL: string, config = {}) => {
  const client = axios.create({
    baseURL,
    timeout: API_CONFIG.REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json'
    },
    ...config
  })

  return client
}
