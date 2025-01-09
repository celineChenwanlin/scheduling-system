import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isValidKey } from "../../helper.ts";
import { RootState } from "../reducers/index.ts";

export type TSearchParams = {
  planeId: string[];
  selectedTime: [Date, Date] | [];
  type: string;
};
type TInitialState = {
  searchParams: TSearchParams;
};

const initialState: TInitialState = {
  searchParams: {
    type: "",
    planeId: [],
    selectedTime: [],
  },
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setStateParams: (state, action: PayloadAction<any>) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export const { setStateParams } = homeSlice.actions;
export const selectHome = (state: RootState) => state.home;
export default homeSlice.reducer;
