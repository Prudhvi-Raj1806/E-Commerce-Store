'use client'

import { useState, useEffect, useCallback } from 'react'

interface AuthUser {
  id: string
  name: string
  email: string
  company?: string
  role: 'admin' | 'customer' | 'sales'
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
}

// Using relative paths for client-side API requests

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/me`, {
        credentials: 'include',
      })

      if (res.ok) {
        const data = (await res.json()) as { user: AuthUser }
        setState({ user: data.user, isLoading: false, error: null })
      } else {
        setState({ user: null, isLoading: false, error: null })
      }
    } catch {
      setState({ user: null, isLoading: false, error: null })
    }
  }, [])

  useEffect(() => {
    void fetchCurrentUser()
  }, [fetchCurrentUser])

  const login = async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const res = await fetch(`/api/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        const data = (await res.json()) as { user: AuthUser }
        setState({ user: data.user, isLoading: false, error: null })
        return true
      } else {
        const error = (await res.json()) as { message?: string }
        setState({
          user: null,
          isLoading: false,
          error: error.message ?? 'Login failed',
        })
        return false
      }
    } catch {
      setState({ user: null, isLoading: false, error: 'Network error' })
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await fetch(`/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setState({ user: null, isLoading: false, error: null })
    }
  }

  const register = async (data: {
    name: string
    email: string
    password: string
    company?: string
  }): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const res = await fetch(`/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role: 'customer' }),
      })

      if (res.ok) {
        return login(data.email, data.password)
      } else {
        const error = (await res.json()) as { message?: string }
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message ?? 'Registration failed',
        }))
        return false
      }
    } catch {
      setState((prev) => ({ ...prev, isLoading: false, error: 'Network error' }))
      return false
    }
  }

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: Boolean(state.user),
    isAdmin: state.user?.role === 'admin',
    login,
    logout,
    register,
    refresh: fetchCurrentUser,
  }
}
