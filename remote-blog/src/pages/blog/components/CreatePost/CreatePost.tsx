/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment, useEffect, useState } from 'react'
import { Post } from '../../../../types/blog.type'
import { useSelector } from 'react-redux'
import { addPost, cancelEditingPost, updatePost } from '../../blog.slice'
import { RootState, useAppDispatch } from '../../../../store'
import { unwrapResult } from '@reduxjs/toolkit'

interface ErrorForm {
  publishDate: string
}

const initialState: Post = {
  description: '',
  featuredImage: '',
  publishDate: '',
  published: false,
  title: '',
  id: ''
}

export default function CreatePost() {
  const [formData, setFormData] = useState<Post>(initialState)
  const editingPost = useSelector((state: RootState) => state.blog.editingPost)
  const [errorForm, setErrorForm] = useState<null | ErrorForm>(null)
  const loading = useSelector((state: RootState) => state.blog.loading)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setFormData(editingPost || initialState)
  }, [editingPost])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (editingPost) {
      dispatch(
        updatePost({
          postId: editingPost.id,
          body: formData
        })
      )
        .unwrap()
        .then(() => {
          setFormData(initialState)
          if (errorForm) {
            setErrorForm(null)
          }
        })
        .catch((err) => {
          setErrorForm(err.error)
        })
    } else {
      try {
        const res = await dispatch(addPost(formData))
        unwrapResult(res)
        setFormData(initialState)
        if (errorForm) {
          setErrorForm(null)
        }
      } catch (err: any) {
        setErrorForm(err.error)
      }
    }
  }

  const handleCancelEditingPost = () => dispatch(cancelEditingPost())

  return (
    <div className='md:container px-4 mx-auto'>
      <form onSubmit={handleSubmit} onReset={handleCancelEditingPost}>
        <div className='mb-6'>
          <label htmlFor='title' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
            Title
          </label>
          <input
            type='text'
            id='title'
            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
            placeholder='Title'
            required
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div className='mb-6'>
          <label htmlFor='featuredImage' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
            Featured Image
          </label>
          <input
            type='text'
            id='featuredImage'
            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
            placeholder='Url image'
            required
            value={formData.featuredImage}
            onChange={(e) => setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))}
          />
        </div>
        <div className='mb-6'>
          <div>
            <label htmlFor='description' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400'>
              Description
            </label>
            <textarea
              id='description'
              rows={3}
              className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
              placeholder='Your description...'
              required
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
        </div>
        <div className='mb-6'>
          <label
            htmlFor='publishDate'
            className={`mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300 ${
              errorForm?.publishDate ? 'text-red-700' : 'text-gray-900'
            }`}
          >
            Publish Date
          </label>
          <input
            type='datetime-local'
            id='publishDate'
            className={`block w-56 rounded-lg border  p-2.5 text-sm focus:outline-none ${
              errorForm?.publishDate
                ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder='Title'
            required
            value={formData.publishDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, publishDate: e.target.value }))}
          />

          {errorForm?.publishDate && (
            <p className='mt-2 text-sm text-red-600'>
              <span className='font-medium'>Error! </span>
              {errorForm?.publishDate}
            </p>
          )}
        </div>
        <div className='mb-6 flex items-center'>
          <input
            id='publish'
            type='checkbox'
            className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
            checked={formData.published}
            onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
          />
          <label htmlFor='publish' className='ml-2 text-sm font-medium text-gray-900'>
            Publish
          </label>
        </div>
        <div>
          {!editingPost && (
            <button
              className='group relative mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800'
              type='submit'
              disabled={loading}
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Publish Post
              </span>
            </button>
          )}

          {editingPost && (
            <Fragment>
              <button
                type='submit'
                className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
                disabled={loading}
              >
                <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                  Update Post
                </span>
              </button>
              <button
                type='reset'
                className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400'
                disabled={loading}
              >
                <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                  Cancel
                </span>
              </button>
            </Fragment>
          )}
        </div>
      </form>
    </div>
  )
}
