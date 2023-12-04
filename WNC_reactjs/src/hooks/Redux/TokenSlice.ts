import {
  AnyAction,
  Dispatch,
  MiddlewareAPI,
  PayloadAction,
  createSlice,
} from "@reduxjs/toolkit";
const initalState: string = "";
const TokenSlice = createSlice({
  name: "AccessToken",
  initialState: initalState,
  reducers: {
    setToken: function (state, payload: PayloadAction<string>) {
      return payload.payload;
    },
  },
});

export const { setToken } = TokenSlice.actions;
export default TokenSlice;
