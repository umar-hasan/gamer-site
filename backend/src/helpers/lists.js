const db = require("../models");

//Checks if a game is a part of any list before removing it completely from the database
async function checkAndRemoveGames(gameId) {
    let game = await db.ListGame.findOne({
        where: {
            gameId
        }
    })

    if (!game) {
        await db.Game.destroy({
            where: {
                id: gameId
            }
        })
    }
}

module.exports = {checkAndRemoveGames}