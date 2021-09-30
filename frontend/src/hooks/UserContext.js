import axios from "axios";
import { createContext, useContext, useState } from "react";

// Determines if user is logged in or not
const UserContext = createContext()

export function UserContextProvider({children}) {

    const [loggedIn, setloggedIn] = useState(false)
    const [user, setuser] = useState(null)

    function login(params) {
        setloggedIn(true)
    }

    function logout(params) {
        setloggedIn(false)
    }

    async function checkUserCookie() {
        try {
           const res = await axios.post("/api/users/", {getUser: false})
           console.log(res.data.message) 
        } catch (error) {
            return false
        }
        
    }

    console.log(loggedIn)

    return (
        <UserContext.Provider value={{loggedIn, setloggedIn, user, setuser, checkUserCookie}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext)