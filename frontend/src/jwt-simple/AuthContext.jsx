import { axiosInstance, axiosInterceptorsInstance } from "./axiosInstance.js"
import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext(null)

export const AuthContextProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    initialLoading: true
  })

  useEffect(() => {
    const authController = new AbortController()

    const checkStatus = async () => {
      // სატესტო დაყოვნებისთვის
      // await axiosInstance.get("https://httpbin.org/delay/1")

      try {
        const response = await axiosInstance.get("/user/auth", {
          signal: authController.signal
        })

        console.log("here 1", response.data.user)
        setAuthState({
          user: response.data.user,
          initialLoading: false
        })
      } catch (error) {
        if (!axios.isCancel(error)) {
          setAuthState((authState) => ({
            ...authState,
            initialLoading: false
          }))
        }
      }
    }

    const logoutInterceptor =
      axiosInterceptorsInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
          if (error.response?.status === 401) {
            window.location.href = "/login"
          }
          return Promise.reject(error)
        }
      )

    checkStatus()

    return () => {
      authController.abort()
      axiosInterceptorsInstance.interceptors.response.eject(logoutInterceptor)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
