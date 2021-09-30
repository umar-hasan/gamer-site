const router = require('express').Router()
const { checkAndRemoveGames } = require('../helpers/lists');
const { getUserInfo } = require('../helpers/token');
const { loggedIn, correctUser } = require('../middleware/auth');
const db = require('../models');


//Creates a new list
router.post('/', loggedIn, async (req, res, next) => {
    try {
        const { name } = req.body
        const userInfo = getUserInfo(req.cookies.token)
        let list = await db.List.create({
            name,
            userId: userInfo.id
        })
        return res.json({ list })
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
        // if (list.user_id !== res.locals.user.id) {
        //     throw new Error("This is not your playlist!")
        // }
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
        return res.json({ lists })
    } catch (error) {
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
                userId: res.locals.user.id
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

        const img = `https://images.igdb.com/igdb/image/upload/t_cover_med_2x/${img_res.data.cover.image_id}.png`

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
                listId: list.id,
                gameId: game.id
            })

        }

        return res.json({lists: taken_lists})
        
    } catch (error) {
        return next(error)
    }
})

//Deletes a game from a list
router.delete('/:user_id/:list_id/:game_id', correctUser, async (req, res, next) => {
    try {
        let deletedRows = await db.ListGame.destroy({
            where: {
                listId: req.params.list_id,
                gameId: req.params.game_id
            }
        })
        if (deletedRows < 1) return res.json({ message: "Nothing removed." })

        let list_game = await db.Game.findOne({
            where: {
                gameId: req.params.game_id
            }
        })

        if (!list_game) {
            await db.Game.destroy({
                where: {
                    id: req.params.game_id
                }
            })
        }

        return res.json({ message: "Game has been successfully removed." })
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

        for (game of list_games) {
            checkAndRemoveGames(game.id)
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