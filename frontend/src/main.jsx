import React from "react"
import ReactDOM from "react-dom/client"
import { SessionsApp } from "./sessions/SessionsApp"
import { JwtSimpleApp } from "./jwt-simple/JwtSimpleApp"
import { JwtRefreshApp } from "./jwt-refresh/JwtRefreshApp"

import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SessionsApp />
    {/* <JwtSimpleApp /> */}
    {/* <JwtRefreshApp /> */}
  </React.StrictMode>
)
