require('dotenv').config()
const jwt = require('jsonwebtoken')
const { isValidToken } = require('../helpers/token')
const SECRET_KEY = process.env.SECRET_KEY


function authenticateUser(req, res, next) {
    try {
        // const authHeader = req.headers && req.headers.authorization;
        // if (authHeader) {
        //     const token = authHeader.replace(/^[Bb]earer /, "").trim()
        //     res.locals.user = jwt.verify(token, SECRET_KEY)
        // }
        // console.log((res.locals))
        const token = req.cookies.token

        const user = isValidToken(token)

        return next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.clearCookie('token')
            return res.status(401).json({ message: "Token expired." })
        }
        return next(error)
    }
}

function loggedIn(req, res, next) {
    try {

        const token = req.cookies.token
        if (!token) return res.status(401).json({ message: "Not logged in!" })

        const user = isValidToken(token)
        // if (!req.cookies.token) throw new Error("Not logged in.")
        return next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.clearCookie('token')
            return res.status(401).json({ message: "Token expired." })
        }
        return next(error)
    }
}

function correctUser(req, res, next) {
    try {
        const token = req.cookies.token

        const user = isValidToken(token)
        console.log(req.params.id)
        if (user) {

            if (user.id !== parseInt(req.params.user_id)) {
                throw new Error("Unauthorized.")
            }
        }
        return next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.clearCookie('token')
            return res.status(401).json({ message: "Token expired." })
        }
        if (error.message === "Unauthorized.") {
            return res.status(401).json({ message: error.message })
        }
        if (error.message === "Not logged in!") {
            return res.status(401).json({ message: error.message })
        }
        return next(error)
    }
}

module.exports = { authenticateUser, loggedIn, correctUser }