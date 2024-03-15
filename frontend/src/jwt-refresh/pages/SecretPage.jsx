import { useState } from "react"
import { axiosInterceptorsInstance } from "../axiosInstance"

export const SecretPage = () => {
  const [secret, setSecret] = useState("")

  const getSecret = async () => {
    const response = await axiosInterceptorsInstance.get("/secret")
    setSecret(response.data.secret)
  }

  return (
    <div className="page-container">
      {/* <button onClick={() => setSecret("")}>clear</button> */}
      <button onClick={getSecret}>Get secret</button>
      <h3>{secret}</h3>
    </div>
  )
}
