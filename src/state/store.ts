import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import loggedinUserReducer from 'features/authentication/reducers/loggedinUserSlice'
import notificationsReducer from 'features/notifications/reducers/notificationsSlice'
import { apiSlice } from '../features/api/apiSlice'

export const store = configureStore({
  reducer: {
    loggedinUser: loggedinUserReducer,
    notifications: notificationsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
