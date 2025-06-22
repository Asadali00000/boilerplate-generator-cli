const { createFileStructure } = require('../utils/fileUtils');

class ReactNativeReduxToolkitBoilerplate {
    generateReduxToolkitBoilerplate(projectPath, options = {}) {
        const structure = {
            'redux/persist/store.js': this.getPersistStore(),
            'redux/reducer/rootReducer.js': this.getReducer(),
            'redux/slices/authSlice.js': this.getAuthSlice(),
            'redux/store.js': this.getStore(),
        };

        createFileStructure(projectPath, structure);

        return {
            dependencies: [
                "react-redux",
                "@reduxjs/toolkit",
                "redux-persist",
                '@react-native-async-storage/async-storage',
            ],
            instructions: [
                'Redux Store Setup:',
    'For normal Redux store: Import and use redux/store.js',
    'For persistent Redux store: Import and use redux/persist/store.js',
            ],
            files: Object.keys(structure),
        };
    }


    getPersistStore() {
        return `import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import rootReducer from "../reducers/rootReducer";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

const persistedRootReducers = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedRootReducers,
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware({
            serializableCheck: false
        })
    ]
})

export const persistor = persistStore(store)`
    }

    getReducer() {
        return `import { combineReducers } from "@reduxjs/toolkit";
import authReducers from '../slices/auth/authSlice'

const rootReducer = combineReducers({
    auth: authReducers,
})

export default rootReducer`
    }

    getAuthSlice(){
        return `import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getApi } from '../../../services/axios/api'
import { deleteSecureItem, setSecureItem } from '../../../services/storage/keychain'

const initialState = {
    token: null,
    user: null,
    status: 'idle',
    error: null,
}

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { data } = await getApi(\`signin?email=\${email}&password=\${password}\`)
            const token = data.token
            await setSecureItem('USER_TOKEN', token)
            return token
        } catch (err) {
            return rejectWithValue(err.message || 'Login failed')
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        logout(state) {
            state.token = null
            state.user = null
            state.status = 'idle'
            state.error = null
            deleteSecureItem('USER_TOKEN')
        }

    },
    extraReducers: (builder) =>
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                state.status = 'succeeded'
                state.token = payload
            })
            .addCase(loginUser.rejected, (state, { payload }) => {
                state.status = 'failed'
                state.error = payload
            }),
})

export const { logout } = authSlice.actions
export default authSlice.reducer`
    }

    getStore(){
        return  `import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/rootReducer";

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware({
            serializableCheck: false
        })
    ]
})

export default store`
    }

}

module.exports = ReactNativeReduxToolkitBoilerplate;