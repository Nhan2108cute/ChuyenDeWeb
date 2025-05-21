import {createSlice} from "@reduxjs/toolkit";
const initState = {
    cates: []
}
export const cateSlice = createSlice({
    name : "cate",
    initialState: initState,
    reducers: {
        loadCate : (state , action) => {
            state.cates.push(...action.payload)
        }
    }
})
export const {loadCate} = cateSlice.actions;