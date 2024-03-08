import { Outlet, NavLink } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../AuthContext"
import { axiosInstance } from "../axiosInstance"

export const RootLayout = () => {
  const { authState, setAuthState } = useContext(AuthContext)

  const logout = async () => {
    try {
      await axiosInstance.delete("/user/logout")
      setAuthState({ ...authState, user: null })
    } catch (error) {
      console.log("Error")
    }
  }

  return (
    <div className="header-container">
      <header>
        <h1>JWT Simple</h1>
        <nav>
          {authState.initialLoading ? (
            <div className="loading-container">
              <div className="skeleton-loading"></div>
              <div className="skeleton-loading"></div>
              <div className="skeleton-loading"></div>
              <div className="skeleton-loading"></div>
            </div>
          ) : (
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              {authState.user ? (
                <>
                  <li>
                    <NavLink to="/secret">Secret</NavLink>
                  </li>
                  <li>
                    <button onClick={logout}>Logout</button>
                  </li>
                  <li>
                    <img
                      src="https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
                      alt="Profile picture"
                    />
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/login">Login</NavLink>
                  </li>
                  <li>
                    <NavLink to="/register">Register</NavLink>
                  </li>
                </>
              )}
            </ul>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
