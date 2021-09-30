import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useUserContext } from './UserContext'

export default function ProtectedRoute({path="", children}) {


    const {loggedIn, user} = useUserContext()

    if (loggedIn) {

        return (
            <Route exact path={`/user/${user.id}/${path}`}>
                {children}
            </Route>
        )

    }

    return (
        <Redirect to="/" />
    )
}
