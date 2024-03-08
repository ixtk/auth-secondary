import { Form, Formik, Field, ErrorMessage } from "formik"
import { useContext } from "react"
import { AuthContext } from "../AuthContext"
import { axiosInstance } from "../axiosInstance"
import { useNavigate } from "react-router-dom"

export const RegisterPage = () => {
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  }

  const navigate = useNavigate()

  const { authState, setAuthState } = useContext(AuthContext)

  const registerUser = async (registerValues, { setSubmitting, setStatus }) => {
    try {
      const response = await axiosInstance.post(
        "/user/register",
        registerValues
      )
      setAuthState({ ...authState, user: response.data.user })
      setSubmitting(false)
    } catch (error) {
      setStatus({ message: error.response.data })
    }

    navigate("/secret")
  }

  return (
    <div className="form-page-container">
      <Formik initialValues={initialValues} onSubmit={registerUser}>
        {(formikProps) => {
          return (
            <Form className="form-container" autoComplete="off">
              <div>
                <label htmlFor="username">Username</label>
                <Field name="username" id="username" type="text" />
                <ErrorMessage name="username" component="span" />
              </div>
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

              <div>
                <label htmlFor="confirmPassword">Confirm password</label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                />
                <ErrorMessage name="confirmPassword" component="span" />
              </div>
              <button
                type="submit"
                className="register-btn"
                disabled={formikProps.isSubmitting}
              >
                {formikProps.isSubmitting ? "Loading..." : "Register"}
              </button>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
