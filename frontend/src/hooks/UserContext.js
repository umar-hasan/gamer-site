import axios from "axios";
import Cookies from "universal-cookie";
import jwt_decode from 'jwt-decode'
import { createContext, useContext, useState } from "react";

// Determines if user is logged in or not
const UserContext = createContext()

export function UserContextProvider({ children }) {

    const cookies = new Cookies()
    const token = cookies.get('token')

    

    const [user, setuser] = useState(token ? {
        id: jwt_decode(token).id,
        username: jwt_decode(token).username
    } : null)
    const [loggedIn, setloggedIn] = useState(user ? true : false)


    async function checkUserCookie() {
        try {
            const res = await axios.post("/api/users/", { getUser: false })
            console.log(res.data.message)
        } catch (error) {
            return false
        }

    }

    console.log(loggedIn)

    return (
        <UserContext.Provider value={{ loggedIn, setloggedIn, user, setuser, checkUserCookie }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext)