import { axiosInstance, axiosInterceptorsInstance } from "./axiosInstance.js"
import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext(null)

export const AuthContextProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    initialLoading: true
  })

  useEffect(() => {
    const controller = new AbortController()

    const checkStatus = async () => {
      // await axiosInstance.get("https://httpbin.org/delay/1")

      try {
        const response = await axiosInstance.get("/user/auth", {
          signal: controller.signal
        })
        setAuthState((prevAuthState) => ({
          ...prevAuthState,
          user: response.data.user,
          initialLoading: false
        }))
      } catch (error) {
        setAuthState((prevAuthState) => ({
          ...prevAuthState,
          initialLoading: false
        }))
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
      controller.abort()
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
