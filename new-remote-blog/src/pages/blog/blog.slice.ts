import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BlogState {
  postId: string
}

const initialState: BlogState = {
  postId: ''
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    startEditPost(state, action: PayloadAction<string>) {
      state.postId = action.payload
    },
    cancelEditPost(state) {
      state.postId = ''
    }
  }
})

const blogReducer = blogSlice.reducer

export default blogReducer

export const { startEditPost, cancelEditPost } = blogSlice.actions