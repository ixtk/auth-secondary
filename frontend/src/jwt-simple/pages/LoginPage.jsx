import { Form, Formik, ErrorMessage, Field } from "formik"
import { useContext } from "react"
import { AuthContext } from "../AuthContext.jsx"
import { axiosInstance } from "../axiosInstance.js"
import { Link, useNavigate } from "react-router-dom"

export const LoginPage = () => {
  const initialValues = {
    email: "",
    password: ""
  }

  const { authState, setAuthState } = useContext(AuthContext)
  const navigate = useNavigate()

  const loginUser = async (loginValues, { setSubmitting, setStatus }) => {
    try {
      const response = await axiosInstance.post("/user/login", loginValues)
      setAuthState({ ...authState, user: response.data.user })
      navigate("/secret")
    } catch (error) {
      setStatus({ message: error.response.data.message })
    }
    setSubmitting(false)
  }

  return (
    <div className="form-page-container">
      <Formik
        initialValues={initialValues}
        onSubmit={loginUser}
        // validationSchema={loginSchema}
      >
        {(formikProps) => {
          return (
            <Form className="form-container" autoComplete="off">
              <div>
                <label htmlFor="email">Email</label>
                <Field id="email" name="email" type="text" />
                <ErrorMessage name="email" component="span" />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <Field id="password" name="password" type="password" />
                <ErrorMessage name="password" component="span" />
              </div>
              <div className="form-aside">
                <span>
                  Don't have an account? <Link to="/register">Register</Link>
                </span>
                <button type="submit" disabled={formikProps.isSubmitting}>
                  {formikProps.isSubmitting ? "Loading..." : "Login"}
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
