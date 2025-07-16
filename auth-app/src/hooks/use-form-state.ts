import { useState, useTransition, type FormEvent } from "react"

interface FormState {
  success: boolean
  message: string | null
  errors: Record<string, { errors: string[] }> | null | undefined
}

export function useFormState(
  action: (formData: FormData) => Promise<FormState>,
  initialState?: FormState
){

  const [isPending, startTransition] = useTransition()
  
  const [formState, setFormState] = useState(initialState ?? {
    success: false,
    message: null,
    errors: null,
  })
  
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const state = await action(formData)

      setFormState(state)
    })
  }

  return [formState, handleSubmit, isPending] as const
}