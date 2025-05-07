// src/pages/recipes/RecipeEditForm.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiCamera, FiVideo, FiX } from 'react-icons/fi'
import Sidebar from '../../components/Sidebar'
import { useRecipe, useUpdateRecipe } from '../../hooks/useRecipes'

export default function RecipeEditForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: recipe, isLoading: loadingRecipe } = useRecipe(id)
  const { mutate, isLoading: rqLoading } = useUpdateRecipe()

  // Local submitting state
  const [submitting, setSubmitting] = useState(false)
  const isBusy = submitting || rqLoading

  const [form, setForm] = useState({
    topic: '',
    description: '',
    photo: null,
    video: null,
  })
  const [errors, setErrors] = useState({})
  const [previewPhoto, setPreviewPhoto] = useState('')
  const [previewVideo, setPreviewVideo] = useState('')
  const [serverError, setServerError] = useState('')

  // Load existing recipe into form
  useEffect(() => {
    if (recipe) {
      setForm({
        topic: recipe.topic,
        description: recipe.description,
        photo: null,
        video: null,
      })
      setPreviewPhoto(recipe.photoUrl || '')
      setPreviewVideo(recipe.videoUrl || '')
    }
  }, [recipe])

  // Full-page loader while fetching
  if (loadingRecipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const validate = () => {
    const errs = {}
    if (!form.topic.trim()) errs.topic = 'Topic required'
    if (!form.description.trim()) errs.description = 'Description required'
    return errs
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setServerError('')
  }

  const handleFile = (e, type) => {
    const file = e.target.files[0]
    setForm(prev => ({
      ...prev,
      [type]: file,
      ...(type === 'photo' ? { video: null } : { photo: null })
    }))
    if (type === 'photo') {
      setPreviewPhoto(file ? URL.createObjectURL(file) : '')
      setPreviewVideo('')
    } else {
      setPreviewVideo(file ? URL.createObjectURL(file) : '')
      setPreviewPhoto('')
    }
  }

  const removeMedia = type => {
    setForm(prev => ({ ...prev, [type]: null }))
    if (type === 'photo') setPreviewPhoto('') 
    else setPreviewVideo('')
  }

  const handleSubmit = e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    const data = new FormData()
    data.append('topic', form.topic)
    data.append('description', form.description)
    if (form.photo) data.append('photo', form.photo)
    if (form.video) data.append('video', form.video)

    setSubmitting(true)
    mutate(
      { id, formData: data },
      {
        onSuccess: () => navigate(`/recipes/${id}`),
        onError: err => setServerError(err.message || 'Update failed'),
        onSettled: () => setSubmitting(false)
      }
    )
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg relative">
          {/* Overlay spinner when busy */}
          {isBusy && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-2xl z-10">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <h2 className="text-2xl font-bold mb-6">Edit Recipe</h2>
          {serverError && (
            <div className="mb-4 text-red-600">{serverError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic */}
            <div>
              <label className="block font-medium mb-1">Topic</label>
              <input
                name="topic"
                value={form.topic}
                onChange={handleChange}
                disabled={isBusy}
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  errors.topic ? 'border-red-500' : 'border-gray-300'
                } ${isBusy ? 'bg-gray-100' : ''}`}
              />
              {errors.topic && (
                <p className="text-red-500 text-sm">{errors.topic}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={isBusy}
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } ${isBusy ? 'bg-gray-100' : ''}`}
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Media Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Photo */}
              <div>
                <label className="block font-medium mb-1">Photo</label>
                <label
                  className={`flex items-center p-4 border-dashed border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                    isBusy ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FiCamera className="text-xl mr-2 text-gray-600" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isBusy}
                    className="hidden"
                    onChange={e => handleFile(e, 'photo')}
                  />
                </label>
                {previewPhoto && (
                  <div className="relative mt-2">
                    <img
                      src={previewPhoto}
                      alt=""
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia('photo')}
                      disabled={isBusy}
                      className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                    >
                      <FiX className="text-gray-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Video */}
              <div>
                <label className="block font-medium mb-1">Video</label>
                <label
                  className={`flex items-center p-4 border-dashed border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                    isBusy ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FiVideo className="text-xl mr-2 text-gray-600" />
                  <span>Choose Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    disabled={isBusy}
                    className="hidden"
                    onChange={e => handleFile(e, 'video')}
                  />
                </label>
                {previewVideo && (
                  <div className="relative mt-2">
                    <video
                      src={previewVideo}
                      className="w-full h-40 object-cover rounded-lg"
                      controls
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia('video')}
                      disabled={isBusy}
                      className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                    >
                      <FiX className="text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isBusy}
              className={`w-full flex justify-center items-center py-3 rounded-lg font-semibold text-white transition ${
                isBusy ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isBusy ? 'Updating…' : 'Update Recipe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
