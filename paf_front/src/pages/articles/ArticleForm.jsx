import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCamera, FiX } from 'react-icons/fi'
import Sidebar from '../../components/Sidebar'
import { useCreateArticle } from '../../hooks/useArticles'

export default function ArticleForm() {
  const navigate = useNavigate()
  const { mutate, isLoading: rqLoading } = useCreateArticle()
  const [submitting, setSubmitting] = useState(false)
  const isBusy = rqLoading || submitting

  const [form, setForm] = useState({ title:'', description:'', photo:null })
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title='Title required'
    if (!form.description.trim()) e.description='Description required'
    if (!form.photo) e.photo='Please select a photo'
    return e
  }

  const handleFile = e => {
    const f = e.target.files[0]
    setForm(prev=>({...prev,photo:f}))
    setPreview(f?URL.createObjectURL(f):null)
  }
  const removePreview = () => {
    setForm(prev=>({...prev,photo:null}))
    setPreview(null)
  }

  const handleSubmit = e => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setSubmitting(true)
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    fd.append('photo', form.photo)
    mutate(fd,{
      onSuccess: a=>navigate(`/articles/${a.id}`),
      onError: err=>setServerError(err.message||'Failed'),
      onSettled: ()=>setSubmitting(false)
    })
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
          <h2 className="text-2xl font-bold mb-6">Create Article</h2>
          {serverError && <div className="mb-4 text-red-600">{serverError}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <div>
              <label className="block mb-1 font-medium">Photo</label>
              <label className={`flex items-center p-4 border-dashed border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${isBusy?'opacity-50 cursor-not-allowed':''}`}>
                <FiCamera className="text-xl mr-2 text-gray-600"/>
                <span>Choose Photo</span>
                <input type="file" accept="image/*" className="hidden" disabled={isBusy} onChange={handleFile}/>
              </label>
              {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}
              {preview && (
                <div className="relative mt-2">
                  <img src={preview} className="w-full h-52 object-cover rounded-lg"/>
                  <button type="button" onClick={removePreview} disabled={isBusy} className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
                    <FiX className="text-gray-600"/>
                  </button>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isBusy}
              className={`w-full py-3 rounded-lg font-semibold text-white ${isBusy?'bg-gray-400 cursor-not-allowed':'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isBusy?'Creating…':'Create Article'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
