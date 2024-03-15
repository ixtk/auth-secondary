import { axiosInstance, axiosInterceptorsInstance } from "./axiosInstance.js"
import { createContext, useState, useEffect } from "react"

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

        setAuthState({
          user: response.data.user,
          initialLoading: false
        })
      } catch (error) {
        try {
          const response = await axiosInstance.post("/refresh")

          setAuthState({
            user: response.data.user,
            initialLoading: false
          })
        } catch (error) {
          setAuthState((prevAuthState) => ({
            ...prevAuthState,
            initialLoading: false
          }))
        }
      }
    }

    const logoutInterceptor =
      axiosInterceptorsInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error?.config

          if (error.response?.status === 401) {
            try {
              await axiosInstance.post("/refresh")
              return axiosInstance(originalRequest)
            } catch (error) {
              window.location.href = "/login"
            }
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
