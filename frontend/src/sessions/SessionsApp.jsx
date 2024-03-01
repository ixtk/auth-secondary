import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate
} from "react-router-dom"
import { useContext, useEffect } from "react"

import { AuthContextProvider, AuthContext } from "./AuthContext"
import {
  RootLayout,
  HomePage,
  LoginPage,
  RegisterPage,
  SecretPage
} from "./pages"

const ProtectedRoute = ({ children }) => {
  const { authState } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authState.initialLoading && !authState.user) {
      navigate("/login")
    }
  }, [authState, navigate])

  return authState.user ? children : null
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route
        path="secret"
        element={
          <ProtectedRoute>
            <SecretPage />
          </ProtectedRoute>
        }
      />
      <Route path="register" element={<RegisterPage />} />
    </Route>
  )
)

export const SessionsApp = () => {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  )
}