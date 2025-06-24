import * as Keychain from 'react-native-keychain';

export const setSecureItem = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await Keychain.setGenericPassword("__DUMMY_USER__", jsonValue, { service: key });
    } catch (error) {
         console.error(`Error setting secure item [${key}]:`, error);
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
        console.error(`Error getting secure item [${key}]:`, error);
        return null;
    }
};

export const deleteSecureItem = async (key) => {
    try {
        await Keychain.resetGenericPassword({ service: key });
    } catch (error) {
       console.error(`Error deleting secure item [${key}]:`, error);
    }
};
