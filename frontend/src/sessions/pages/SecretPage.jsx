import { useState } from "react"
import { axiosInterceptorsInstance } from "../axiosInstance"
import { Button } from "@/components/ui/Button"

export const SecretPage = () => {
  const [secret, setSecret] = useState("")

  const getSecret = async () => {
    const response = await axiosInterceptorsInstance.get("/secret")
    setSecret(await response.data.secret)
  }

  return (
    <div className="max-w-lg mx-auto my-4">
      <Button onClick={getSecret}>Get secret</Button>
      <h1 className="mt-4">{secret}</h1>
    </div>
  )
}
