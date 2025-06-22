const { createFileStructure } = require('../utils/fileUtils');

class ReactNativeServicesBoilerplate {
    generateServicesBoilerplate(projectPath, options = {}) {
        const structure = {
            'services/axios/api.js': this.getServicesApi(),
            'services/storage/keychain.js': this.getServicesStorage(),
        };

        createFileStructure(projectPath, structure);

        return {
            dependencies: [
                "axios",
                "react-native-config",
                "react-native-keychain",
            ],
            instructions: [
                `react-native-config`,
                'Create a new file .env in the root of your React Native app:',
                'In .env (project root), use: API_URL=https://myapi.com',
                `Extra step for Android 
                You'll also need to manually apply a plugin to your app, from android/app/build.gradle:`,
                `apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"`,
            ],
            files: Object.keys(structure),
        };
    }


    getServicesApi() {
        return `import axios from 'axios'
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
}`
    }

    getServicesStorage() {
        return `import * as Keychain from 'react-native-keychain';

export const setSecureItem = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await Keychain.setGenericPassword("__DUMMY_USER__", jsonValue, { service: key });
    } catch (error) {
         console.error(\`Error setting secure item [\${key}]:\`, error);
    }
};

export const getSecureItem = async (key) => {
    try {
        const credentials = await Keychain.getGenericPassword({ service: key });
        if (credentials && credentials.username === "__DUMMY_USER__") {
            return JSON.parse(credentials.password);
        }
        return null;
    } catch (error) {
        console.error(\`Error getting secure item [\${key}]:\`, error);
        return null;
    }
};

export const deleteSecureItem = async (key) => {
    try {
        await Keychain.resetGenericPassword({ service: key });
    } catch (error) {
       console.error(\`Error deleting secure item [\${key}]:\`, error);
    }
};
`
    }


}

module.exports = ReactNativeServicesBoilerplate;