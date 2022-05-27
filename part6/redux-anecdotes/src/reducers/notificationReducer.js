import { createSlice } from "@reduxjs/toolkit"

const initialState = ''

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotificationText(state, action) {
            return action.payload
        }
    }
})

export const { setNotificationText } = notificationSlice.actions

export const setNotification = (message, time=5) => {
    return dispatch => {
        dispatch(setNotificationText(message))
        window.setTimeout(() => dispatch(setNotificationText('')), time*1000)
    }
}

export default notificationSlice.reducer