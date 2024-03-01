import { Outlet, NavLink } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../AuthContext"
import { axiosInstance } from "../axiosInstance"
import { Skeleton } from "@/components/ui/skeleton"

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
    <div className="max-w-5xl mx-auto px-3">
      <header className="border-b py-5 mb-6 flex justify-between">
        <h1 className="text-lg font-medium">JWT Simple</h1>
        <nav>
          {authState.initialLoading ? (
            <div className="flex flex-row-reverse gap-4 items-center">
              <Skeleton className="w-[35px] h-[35px] rounded-full" />
              <Skeleton className="w-[70px] h-[20px] rounded-full" />
              <Skeleton className="w-[70px] h-[20px] rounded-full" />
              <Skeleton className="w-[70px] h-[20px] rounded-full" />
            </div>
          ) : (
            <ul className="flex justify-end gap-4 items-center">
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
                  <li className="flex items-center gap-x-4">
                    {/* <span>{authState.user.username}</span> */}
                    <img
                      src={
                        authState.user.profilePicture ||
                        "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
                      }
                      alt="Profile picture"
                      className="h-[35px] rounded-full"
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
