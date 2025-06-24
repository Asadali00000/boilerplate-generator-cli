import axios from 'axios'
import Config from 'react-native-config'
import { getSecureItem } from '../storage/keychain'

const api = axios.create({
    baseURL: Config.API_URL,
    timeout: 1 * 60 * 1000,
    headers: {
        "Content-Type": 'application/json'
    }
})

api.interceptors.request.use(
    async config => {
        const token = await getSecureItem('USER_TOKEN')
        if (token) config.headers.Authorization = token;
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    response => {
        console.log('Inceptor response ---> ', response)
        return response
    },
    error => {
        console.log('Inceptor response error ---> ', error?.response)
        return Promise.reject(error?.response)
    }
)

export const getApi = async (endpoint) => {
    try {
        const response = await api.get(endpoint)
        console.log('getApi response -->', response)
        return response
    } catch (error) {
        console.log('getApi error -->', error)
        throw error
    }
}


export const postApi = async (endpoint, data) => {
    try {
        const response = await api.post(endpoint, data)
        console.log('postApi response -->', response)
        return response
    } catch (error) {
        console.log('postApi error -->', error)
        throw error
    }
}

export const putApi = async (endpoint, data) => {
    try {
        const response = await api.put(endpoint, data)
        console.log('putApi response -->', response)
        return response
    } catch (error) {
        console.log('putApi error -->', error)
        throw error
    }
}

export const deleteApi = async (endpoint) => {
    try {
        const response = await api.delete(endpoint)
        console.log('deleteApi response -->', response)
        return response
    } catch (error) {
        console.log('deleteApi error -->', error)
        throw error
    }
}