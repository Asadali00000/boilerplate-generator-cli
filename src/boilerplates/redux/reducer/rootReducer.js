import { combineReducers } from "@reduxjs/toolkit";
import authReducers from '../slices/auth/authSlice'

const rootReducer = combineReducers({
    auth: authReducers,
})

export default rootReducer