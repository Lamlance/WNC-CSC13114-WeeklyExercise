import {
  AnyAction,
  Dispatch,
  MiddlewareAPI,
  PayloadAction,
  createSlice,
} from "@reduxjs/toolkit";
const initalState: string = "";
const LoadingSlice = createSlice({
  name: "Loading",
  initialState: initalState,
  reducers: {
    setLoading: function (state, payload: PayloadAction<string>) {
      return payload.payload;
    },
  },
});

export const { setLoading } = LoadingSlice.actions;
export default LoadingSlice;
