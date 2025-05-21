import {configureStore} from "@reduxjs/toolkit";
import {cateSlice} from "./cateReducer";

export const store = configureStore({
    reducer : {
        cate: cateSlice.reducer,
    }
})