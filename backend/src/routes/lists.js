const router = require('express').Router()
const { checkAndRemoveGames } = require('../helpers/lists');
const { getUserInfo } = require('../helpers/token');
const { loggedIn, correctUser } = require('../middleware/auth');
const db = require('../models');
const axios = require('axios')


//Creates a new list
router.post('/', loggedIn, async (req, res, next) => {
    try {
        const { name, description } = req.body
        const userInfo = getUserInfo(req.cookies.token)
        console.log(userInfo)
        let list = await db.List.create({
            name,
            description,
            userId: userInfo.id
        })

        return res.json({ list: {
            id: list.id,
            name: list.name,
            description: list.description,
            userId: list.userId,
            games: []
        } })
    } catch (error) {
        return next(error)
    }
})

//Get one list for a user
router.get('/:user_id/:id', correctUser, async (req, res, next) => {
    try {
        const list = await db.List.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: db.Game,
                as: 'games'
            }
        })
        if (!list) {
            throw new Error("List does not exist!")
        }
        return res.json({ list })
    } catch (error) {
        return next(error)
    }
})

//Get all lists for a user
router.get('/:user_id', correctUser, async (req, res, next) => {
    try {
        const lists = await db.List.findAll({
            where: {
                userId: req.params.user_id
            },
            include: {
                model: db.Game,
                as: 'games'
            }
        })
        console.log("---------------")
        console.log(lists[0].games[0])
        return res.json({ lists })
    } catch (error) {
        if (error.message === "Not logged in!") {
            return res.status(401).json({ message: "Not logged in!" })
        }
        return next(error)
    }
})

//Update name of list
router.put('/:user_id/:id', correctUser, async (req, res, next) => {
    try {
        const { name, description } = req.body
        let list = await db.List.update({
            name, description
        }, {
            where: {
                id: req.params.id,
                userId: req.params.user_id
            }
        })

        list = await db.List.findOne({
            where: {
                id: req.params.id,
                userId: req.params.user_id
            }
        })

        return res.json({ list })
    } catch (error) {
        return next(error)
    }
})

//Add game to list(s)
router.put('/:game_id', loggedIn, async (req, res, next) => {
    try {
        const { name, lists } = req.body
        const userInfo = getUserInfo(req.cookies.token)
        let game = await db.Game.findOne({
            where: {
                id: req.params.game_id
            }
        })

        const taken_lists = []

        for (let l of lists) {

            let list_game = await db.ListGame.findOne({
                where: {
                    gameId: req.params.game_id,
                    listId: l
                }
            })

            if (list_game) continue

            let list = await db.List.findOne({
                where: {
                    id: l,
                    userId: userInfo.id
                },
                include: {
                    model: db.Game,
                    as: 'games'
                }
            })

            if (!list) throw new Error("List doesn't exist!")

            if (list && list.userId !== userInfo.id) throw new Error("This is not your playlist!")

            taken_lists.push(list)

        }


        const img_res = await axios.post(`https://api.igdb.com/v4/games`,
            `fields cover.image_id;
                where id = ${req.params.game_id};`,
            {
                headers: {
                    "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                    "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                }

            })

        console.log("***")
        console.log(taken_lists)
        let img = `https://images.igdb.com/igdb/image/upload/t_cover_med_2x/${img_res.data[0].cover.image_id}.png`

        if (!img_res.data) img = null

        if (!game) {
            game = await db.Game.create({
                id: req.params.game_id,
                name,
                img_url: img
            })
        }

        for (let l of taken_lists) {

            await db.ListGame.create({
                listId: l.id,
                gameId: game.id
            })

        }

        return res.json({ lists: taken_lists })

    } catch (error) {
        return next(error)
    }
})

//Deletes a game from a list
router.delete('/:user_id/:list_id/:game_id', correctUser, async (req, res, next) => {
    try {
        let list_game = await db.ListGame.destroy({
            where: {
                listId: req.params.list_id,
                gameId: req.params.game_id
            }
        })
        if (list_game < 1) return res.json({ message: "Nothing removed." })

        checkAndRemoveGames(list_game.id)

        const updated_list = await db.List.findOne({
            where: {
                id: req.params.list_id
            },
            include: {
                model: db.Game,
                as: 'games'
            }
        })

        console.log("HERE")
        console.log(updated_list)

        return res.json({ updated_list })
    } catch (error) {
        return next(error)
    }
})


//Deletes a list
router.delete('/:user_id/:id', correctUser, async (req, res, next) => {
    try {
        const list_games = await db.ListGame.findAll({
            where: {
                listId: req.params.id
            }
        })

        await db.ListGame.destroy({
            where: {
                listId: req.params.id
            }
        })

        console.log(list_games)

        for (let game of list_games) {
            checkAndRemoveGames(game.gameId)
        }

        let deletedRows = await db.List.destroy({
            where: {
                id: req.params.id,
                userId: req.params.user_id
            }
        })
        if (deletedRows < 1) return res.json({ message: "Nothing deleted." })

        return res.json({ message: "Successfully deleted." })
    } catch (error) {
        return next(error)
    }
})



module.exports = router