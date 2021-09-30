const router = require('express').Router()
const { loggedIn, correctUser } = require('../middleware/auth');
const db = require('../models');
const axios = require('axios')


router.get('/:list_id/:id/img', loggedIn, async (req, res, next) => {
    try {

        const list_game = await db.ListGame.findOne({
            where: {
                list_id: req.params.list_id,
                game_id: req.params.id
            }
        })

        if (!list_game) {
            return res.json({ message: "No list exists!" })
        }

        const api_res = axios.post('https://api.igdb.com/v4/games', `
                fields id, cover.image_id;
                where id=${req.params.id};`,
                {
                    headers: {
                        "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                        "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                    }
    
                })

                

        return res.json({ list_game })

    } catch (error) {
        return next(error)
    }



})

module.exports = router