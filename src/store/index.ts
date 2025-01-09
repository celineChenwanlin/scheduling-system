import { persistReducer, persistStore } from "redux-persist";

import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";
import { rootReducer } from "./reducers/index.ts";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const persistConfig = {
  key: "storageType",
  storage,
};
const pReduer = persistReducer(persistConfig, rootReducer);

const middlewareArray = [thunk];

const store = configureStore({
  reducer: pReduer,
  middleware: (GetDefaultMiddleware) =>
    GetDefaultMiddleware({ serializableCheck: false }).concat(
      ...middlewareArray
    ),
});

const persistor = persistStore(store);

export { persistor, store };
type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
