import React from 'react'
import { useCreateRecipe } from '../hooks/useRecipes'

export default function CreateRecipeTester() {
  const { mutate, isLoading, data, error } = useCreateRecipe()

  return (
    <div>
      <button onClick={() => {
        const form = new FormData()
        form.append('topic', 'Test Topic')
        form.append('description', 'Test Description')
        // optionally append photo/video...
        mutate(form)
      }}>
        {isLoading ? 'Creating…' : 'Create Test Recipe'}
      </button>
      {error && <p className="text-red-600">Error: {error.message}</p>}
      {data && <p className="text-green-600">Created recipe ID {data.id}</p>}
    </div>
  )
}
