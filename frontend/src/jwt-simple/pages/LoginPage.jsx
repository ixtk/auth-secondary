import { Form, Formik } from "formik"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "formik"
import { Button } from "@/components/ui/Button"
import { Loader2 } from "lucide-react"
import { useContext } from "react"
import { AuthContext } from "../AuthContext.jsx"
import { axiosInstance } from "../axiosInstance.js"
import { Link, useNavigate } from "react-router-dom"
import { FormStatus } from "../../components/FormStatus.jsx"

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
    <div className="max-w-xs mx-auto my-4 flex flex-col gap-4">
      <Formik
        initialValues={initialValues}
        onSubmit={loginUser}
        // validationSchema={loginSchema}
      >
        {(formikProps) => {
          return (
            <Form className="flex flex-col gap-4">
              {formikProps.status && (
                <FormStatus
                  message={formikProps.status.message}
                  errors={formikProps.status.errors}
                />
              )}
              <div>
                <Label htmlFor="email" className="mb-4 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="text"
                  {...formikProps.getFieldProps("email")}
                />
                <ErrorMessage
                  name="email"
                  component="span"
                  className="text-red-600"
                />
              </div>
              <div>
                <Label htmlFor="password" className="mb-4 block">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...formikProps.getFieldProps("password")}
                />
                <ErrorMessage
                  name="password"
                  component="span"
                  className="text-red-600"
                />
              </div>
              <div className="flex items-center gap-4 justify-between">
                <span>
                  Don't have an account?{" "}
                  <Link className="text-blue-500" to="/register">
                    Register
                  </Link>
                </span>
                <Button
                  type="submit"
                  className="self-end"
                  disabled={formikProps.isSubmitting}
                >
                  {formikProps.isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
