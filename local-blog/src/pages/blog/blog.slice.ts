import { PayloadAction, createSlice, current, nanoid } from '@reduxjs/toolkit'
import { Post } from '../../types/blog.type'
import { initialPostList } from '../../constants/blog'

interface BlogState {
  postList: Post[]
  editingPost: Post | null
}

const initialState: BlogState = {
  postList: initialPostList,
  editingPost: null
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    addPost: {
      reducer: (state: BlogState, action: PayloadAction<Post>) => {
        state.postList.push(action.payload)
      },
      prepare: (post: Omit<Post, 'id'>) => ({
        payload: {
          ...post,
          id: nanoid()
        }
      })
    },

    deletePost: (state: BlogState, action: PayloadAction<string>) => {
      const postId = action.payload
      const foundPostIndex = state.postList.findIndex((post) => post.id === postId)

      if (foundPostIndex >= 0) {
        state.postList.splice(foundPostIndex, 1)
      }
    },
    startEditingPost: (state: BlogState, action: PayloadAction<string>) => {
      const postId = action.payload
      const foundPost = state.postList.find((post) => post.id === postId) || null

      state.editingPost = foundPost
    },
    cancelEditingPost: (state: BlogState) => {
      state.editingPost = null
    },
    finishEditingPost: (state: BlogState, action: PayloadAction<Post>) => {
      const postId = action.payload.id

      state.postList.some((post, index) => {
        if (post.id === postId) {
          state.postList[index] = action.payload
          return true
        }
      })

      state.editingPost = null
    }
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        (action) => action.type.includes('cancel'),
        (state) => {
          console.log(current(state))
        }
      )
      .addDefaultCase((state, action) => {
        console.log(current(state))
        console.log('🚀 ~ file: blog.slice.ts:70 ~ .addDefaultCase ~ action:', action.type)
      })
  }
})

export const { addPost, deletePost, startEditingPost, cancelEditingPost, finishEditingPost } = blogSlice.actions

const blogReducer = blogSlice.reducer

export default blogReducer
