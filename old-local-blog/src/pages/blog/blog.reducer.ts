import { createAction, createReducer, nanoid } from '@reduxjs/toolkit'
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

export const addPost = createAction('blog/addPost', (post: Omit<Post, 'id'>) => {
  return {
    payload: {
      ...post,
      id: nanoid()
    }
  }
})

// export const addPost = createAction<Post>('blog/addPost')

export const deletePost = createAction<string>('blog/deletePost')

export const startEditingPost = createAction<string>('blog/startEditingPost')

export const cancelEditingPost = createAction('blog/cancelEditingPost')

export const finishEditingPost = createAction<Post>('blog/finishEditingPost')

const blogReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      // immerjs help we mutate one state safe
      state.postList.push(action.payload)
    })
    .addCase(deletePost, (state, action) => {
      const postId = action.payload

      const foundPostIndex = state.postList.findIndex((post) => post.id === postId)

      if (foundPostIndex >= 0) {
        state.postList.splice(foundPostIndex, 1)
      }
    })
    .addCase(startEditingPost, (state, action) => {
      const postId = action.payload

      const foundPost = state.postList.find((post) => post.id === postId) || null

      state.editingPost = foundPost
    })
    .addCase(cancelEditingPost, (state) => {
      state.editingPost = null
    })
    .addCase(finishEditingPost, (state, action) => {
      const postId = action.payload.id
      state.postList.some((post, index) => {
        if (post.id === postId) {
          state.postList[index] = action.payload
          return true
        }
      })

      state.editingPost = null
    })
  // .addMatcher(
  //   (action) => action.type.includes('cancel'),
  //   (state) => {
  //     console.log(current(state))
  //   }
  // )
})

// Map Object
// const blogReducer = createReducer(
//   initialState,
//   {
//     [addPost.type]: (state, action: PayloadAction<Post>) => {
//       // immerjs help we mutate one state safe
//       state.postList.push(action.payload)
//     },
//     [deletePost.type]: (state, action: PayloadAction<string>) => {
//       const postId = action.payload

//       const foundPostIndex = state.postList.findIndex((post) => post.id === postId)

//       if (foundPostIndex >= 0) {
//         state.postList.splice(foundPostIndex, 1)
//       }
//     },
//     [startEditingPost.type]: (state, action: PayloadAction<string>) => {
//       const postId = action.payload

//       const foundPost = state.postList.find((post) => post.id === postId) || null

//       state.editingPost = foundPost
//     },
//     [cancelEditingPost.type]: (state) => {
//       state.editingPost = null
//     },
//     [finishEditingPost.type]: (state, action: PayloadAction<Post>) => {
//       const postId = action.payload.id
//       state.postList.some((post, index) => {
//         if (post.id === postId) {
//           state.postList[index] = action.payload
//           return true
//         }
//       })

//       state.editingPost = null
//     }
//   },
//   [
//     {
//       matcher: ((action: any) => action.type.includes('cancel')) as any,
//       reducer(state, action) {
//         console.log(current(state))
//       }
//     }
//   ],
//   (state) => {
//     console.log('state', state)
//   }
// )

export default blogReducer
