import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
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
            const { data } = await getApi(`signin?email=${email}&password=${password}`)
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
export default authSlice.reducer