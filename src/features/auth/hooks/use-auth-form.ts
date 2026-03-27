'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginSchema, registerSchema } from '../schemas/auth.schemas'
import { login, register } from '../services/auth.service'
import type {
  LoginFormState, LoginFormErrors,
  RegisterFormState, RegisterFormErrors,
} from '../types/auth.types'

/* ────────────────────────────────────────────
   Hook Login
   ──────────────────────────────────────────── */
export function useLoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const redirect     = searchParams.get('redirect') ?? '/reserver'

  const [form, setForm]               = useState<LoginFormState>({ email: '', password: '' })
  const [errors, setErrors]           = useState<LoginFormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading]     = useState(false)

  const handleChange = useCallback((field: keyof LoginFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
    setServerError(null)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)

    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: LoginFormErrors = {}
      result.error.issues.forEach(err => {
        const field = err.path[0] as keyof LoginFormState
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    const { user, error } = await login(result.data)
    setIsLoading(false)

    if (error) { setServerError(error); return }
    if (user) {
      /* Full reload — garantit que les nouveaux cookies sont lus */
      window.location.href = redirect
    }
  }

  return { form, errors, serverError, isLoading, handleChange, handleSubmit }
}

/* ────────────────────────────────────────────
   Hook Register
   ──────────────────────────────────────────── */
export function useRegisterForm() {
  const router = useRouter()

  const [form, setForm] = useState<RegisterFormState>({
    firstName: '', lastName: '', email: '',
    phone: '', password: '', confirmPassword: '',
  })
  const [errors, setErrors]           = useState<RegisterFormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading]     = useState(false)

  const handleChange = useCallback((field: keyof RegisterFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
    setServerError(null)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)

    const result = registerSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: RegisterFormErrors = {}
      result.error.issues.forEach(err => {
        const field = err.path[0] as keyof RegisterFormState
        if (!fieldErrors[field]) fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    const { user, error } = await register(result.data)
    setIsLoading(false)

    if (error) { setServerError(error); return }
    /* Après inscription → vers login avec message de succès */
    if (user) router.push('/login?registered=1')
  }

  return { form, errors, serverError, isLoading, handleChange, handleSubmit }
}