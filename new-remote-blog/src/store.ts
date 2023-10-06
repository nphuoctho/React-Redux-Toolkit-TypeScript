import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './pages/blog/blog.slice'
import { blogApi } from './pages/blog/blog.service'
import { setupListeners } from '@reduxjs/toolkit/query'
import { rtkQueryErrorLogger } from './middleware'
// ...

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer // thêm reducer của RTK query vào store được tạo từ api slice
  },

  // Thêm middleware của RTK query vào store để enable các tính năng như caching, error handling, polling...
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogApi.middleware, rtkQueryErrorLogger)
})

// Bắt buộc nếu dùng tính năng refetchOnMount, refetchOnReconnect, refetchOnFocus (Optional)

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
