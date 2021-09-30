require('dotenv').config()
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY

function createToken(user) {
    let payload = {
        id: user.id,
        username: user.username
    }
    return jwt.sign(payload, SECRET_KEY, { expiresIn: 1000 })
    
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
    console.log(t)
    return t
}


module.exports = { createToken, isValidToken, getUserInfo }