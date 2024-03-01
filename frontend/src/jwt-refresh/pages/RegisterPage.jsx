import { Form, Formik } from "formik"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "formik"
import { Button } from "@/components/ui/Button"
import { Loader2 } from "lucide-react"
import { useContext } from "react"
import { AuthContext } from "../AuthContext"
import { axiosInstance } from "../axiosInstance"
import { useNavigate } from "react-router-dom"
import { FormStatus } from "../../components/FormStatus"

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
    <div className="max-w-lg mx-auto my-4">
      <Formik initialValues={initialValues} onSubmit={registerUser}>
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
                <Label htmlFor="username" className="mb-4 block">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  {...formikProps.getFieldProps("username")}
                />
                <ErrorMessage
                  name="username"
                  component="span"
                  className="text-red-600"
                />
              </div>
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
              <div>
                <Label htmlFor="confirmPassword" className="mb-4 block">
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...formikProps.getFieldProps("confirmPassword")}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="span"
                  className="text-red-600"
                />
              </div>
              <Button
                type="submit"
                className="self-end"
                disabled={formikProps.isSubmitting}
              >
                {formikProps.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
