require('dotenv').config()
const jwt = require('jsonwebtoken')

if (process.env.NODE_ENV === "test") process.env.SECRET_KEY = "secret"

const SECRET_KEY = process.env.SECRET_KEY


//Creates a user token
function createToken(user) {
    let payload = {
        id: user.id,
        username: user.username
    }
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '12h' })
    
}

//Checks if a token is valid
function isValidToken(token) {
    if (!token) {
        throw new Error("Not logged in!")
    }
    return jwt.verify(token, SECRET_KEY)
}

//Gets username and ID.
function getUserInfo(token) {
    if (!token) {
        throw new Error("Not logged in!")
    }
    const t = jwt.decode(token)
    return t
}


module.exports = { createToken, isValidToken, getUserInfo }