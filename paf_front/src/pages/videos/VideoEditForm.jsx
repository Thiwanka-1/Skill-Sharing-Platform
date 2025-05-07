import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiVideo, FiX } from 'react-icons/fi'
import Sidebar from '../../components/Sidebar'
import { useVideo, useUpdateVideo } from '../../hooks/useVideos'

export default function VideoEditForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: vid, isLoading } = useVideo(id)
  const { mutate, isLoading: rqLoading } = useUpdateVideo()
  const [submitting, setSubmitting] = useState(false)
  const isBusy = rqLoading || submitting

  const [form, setForm] = useState({ title:'', description:'', video:null })
  const [preview, setPreview] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (vid) {
      setForm({ title: vid.title, description: vid.description, video: null })
      setPreview(vid.videoUrl)
    }
  }, [vid])

  if (isLoading) return <div className="p-8 text-center">Loading…</div>

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title='Title required'
    if (!form.description.trim()) e.description='Description required'
    return e
  }

  const handleFile = e => {
    const f = e.target.files[0]
    setForm(prev=>({ ...prev, video:f }))
    setPreview(f?URL.createObjectURL(f):'')
  }
  const removePreview = () => {
    setForm(prev=>({ ...prev, video:null }))
    setPreview('')
  }

  const handleSubmit = e => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length){ setErrors(e2); return }
    setSubmitting(true)
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    if (form.video) fd.append('video', form.video)
    mutate(
      { id, formData: fd },
      {
        onSuccess: v=>navigate(`/videos/${id}`),
        onError:err=>setServerError(err.message||'Failed'),
        onSettled:()=>setSubmitting(false)
      }
    )
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg relative">
          {isBusy && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"/>
            </div>
          )}
          <h2 className="text-2xl font-bold mb-6">Edit Video</h2>
          {serverError && <div className="mb-4 text-red-600">{serverError}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <input
                value={form.title}
                onChange={e=>{setForm(f=>({...f,title:e.target.value}));setErrors(f=>({...f,title:''}))}}
                disabled={isBusy}
                className={`w-full p-3 border rounded ${errors.title?'border-red-500':'border-gray-300'} ${isBusy?'bg-gray-100':''}`}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>
            {/* Description */}
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                value={form.description}
                onChange={e=>{setForm(f=>({...f,description:e.target.value}));setErrors(f=>({...f,description:''}))}}
                disabled={isBusy}
                rows={3}
                className={`w-full p-3 border rounded ${errors.description?'border-red-500':'border-gray-300'} ${isBusy?'bg-gray-100':''}`}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            {/* Video */}
            <div>
              <label className="block mb-1 font-medium">Video File</label>
              <label className={`flex items-center p-4 border-dashed border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${isBusy?'opacity-50 cursor-not-allowed':''}`}>
                <FiVideo className="text-xl mr-2 text-gray-600" />
                <span>Choose Video</span>
                <input type="file" accept="video/*" className="hidden" disabled={isBusy} onChange={handleFile}/>
              </label>
              {preview && (
                <div className="relative mt-2">
                  <video src={preview} className="w-full h-52 object-cover rounded-lg" controls/>
                  <button type="button" onClick={removePreview} disabled={isBusy} className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
                    <FiX className="text-gray-600"/>
                  </button>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isBusy}
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                isBusy?'bg-gray-400 cursor-not-allowed':'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isBusy?'Updating…':'Update Video'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
