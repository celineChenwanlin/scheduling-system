import { combineReducers } from "redux";

import homeReducer from "../slices/home.ts";

export const rootReducer = combineReducers({
  home: homeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
