import { createSlice } from "@reduxjs/toolkit";

const currentState = {
    currentUser: null,
    loading: false,
    error: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState: currentState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        UpdateUserStart: (state) => {
            state.loading = true;
        },
        UpdateUserSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        UpdateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        DeleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        DeleteUserStart: (state) => {
            state.loading = true;
        },
        DeleteUserSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        SignOutUserStart: (state) => {
            state.loading = true;
        },
        SignOutUserSuccess: (state) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        SignOutUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})

export const { 
    loginStart, 
    loginSuccess, 
    loginFailure, 
    UpdateUserStart, 
    UpdateUserSuccess, 
    UpdateUserFailure,
    DeleteUserStart,
    DeleteUserSuccess,
    DeleteUserFailure,
    SignOutUserStart,
    SignOutUserSuccess,
    SignOutUserFailure,
} 
    = userSlice.actions;
export default userSlice.reducer;