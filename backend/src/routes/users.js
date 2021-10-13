// Handles all of the routes that deal with user authentication, registration, and deletion.

require('dotenv').config()
const router = require('express').Router()
const bcrypt = require('bcrypt')
const db = require('../models')
const { createToken, getUserInfo } = require('../helpers/token')
const {correctUser, loggedIn, authenticateUser} = require('../middleware/auth')
const { checkAndRemoveGames } = require('../helpers/lists')
const HASH_ROUNDS = process.env.HASH_ROUNDS


//Login
router.post('/login', async (req, res, next) => {

    try {

        if (req.cookies.token) {
            throw new Error("A user is already signed in.")
        }

        const { username, password } = req.body

        const user = await db.User.findOne({
            where: {
                username: username
            }
        })

        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                let token = createToken(user)
                res.cookie('token', token, { httpOnly: false })
                
                return res.status(200).json({
                    message: "Success.",
                    token

                })
            }
            else {
                return res.status(500).json({ message: "Invalid password." })
            }
        }
        return res.status(500).json({ message: "Invalid username." })
    } catch (error) {
        next(error)
    }

})

// router.use(authenticateUser)

//Checks if there's a cookie
router.post("/", loggedIn, (req, res, next) => {
    try {
        if (req.body.getUser) {
            const user = getUserInfo(req.cookies.token)
            console.log(user)
            return res.status(200).json({message: "Logged in.", user})
        }
        return res.status(200).json({message: "Logged in."})
    } catch (error) {
        next(error)
        return res.status(401).json({message: "Not logged in."})
    }
})

//Retrieves user information
router.get("/:user_id", correctUser, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: req.params.user_id
            }
        })

        if (!user) throw new Error("User doesn't exist.")

        console.log("***************")
        console.log(user.dataValues.id)

        return res.status(200).json({
            user: {
                id: user.dataValues.id,
                username: user.dataValues.username,
                firstName: user.dataValues.firstName,
                lastName: user.dataValues.lastName
            }})
    } catch (error) {
        next(error)
        return res.status(401).json({message: "Not logged in."})
    }
})


// Updates user information
router.put("/:user_id/update", correctUser, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: req.params.user_id
            }
        })


        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                
                if (req.body.new_password) {
                    if (req.body.new_password === req.body.password) {
                        return res.status(500).json({message: "Your new password can't be the same as your old password."})
                    }

                    let hashedPassword = await bcrypt.hash(req.body.new_password, 12)

                    user.password = hashedPassword

                    await user.save()

                    return res.status(200).json({message: "Password change successful."})

                }

                user.username = req.body.username
                user.first_name = req.body.firstName
                user.last_name = req.body.lastName
        
                await user.save()

                let token = createToken(user)
                res.cookie('token', token, { httpOnly: false })

                return res.status(200).json({message: "User info updated."})
            }
            else {
                return res.status(500).json({ message: "Invalid password." })
            }
        }

        else if (!user) throw new Error("User doesn't exist.")


    } catch (error) {
        next(error)
    }
})


//Logs out user
router.post('/logout', loggedIn, async (req, res, next) => {
    try {
        res.clearCookie('token')
        return res.status(200).json({
            message: "Logged out successfully."
        })
    } catch (error) {
        next(error)
    }
})

//Register
router.post('/register', async (req, res, next) => {

    try {
        const { username, password, first_name, last_name } = req.body

        const user = await db.User.findOne({
            where: {
                username: username
            }
        })

        if (user) {
            return res.status(500).json({ message: "This user already exists!" })
        }
        let hashedPassword = await bcrypt.hash(password, 12)
        db.User.create({
            username,
            password: hashedPassword,
            firstName: first_name,
            lastName: last_name
        })
        return res.status(200).json({ message: "User created successfully." })
    } catch (error) {
        next(error)
    }


})



//Delete
router.delete('/:user_id', correctUser, async (req, res, next) => {
    try {
        let lists = await db.List.findAll({
            where: {
                userId: res.locals.user.id
            }
        })

        for (let list of lists) {
            const list_games = await db.ListGame.findAll({
                where: {
                    listId: list.id
                }
            })
    
            await db.ListGame.destroy({
                where: {
                    listId: list.id
                }
            })
    
            for (game of list_games) {
                checkAndRemoveGames(game.id)
            }

            
        }

        await db.List.destroy({
            where: {
                userId: res.locals.user.id
            }
        })

        await db.User.destroy({
            where: {
                id: res.locals.user.id
            }
        })

        return res.json({message: "Successfully deleted."})
    } catch (error) {
        return next(error)
    }
})




module.exports = router