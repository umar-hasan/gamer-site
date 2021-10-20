
require("dotenv").config()
const axios = require('axios');
const map = require("../config/mapping");
const router = require('express').Router();

router.get('/home', async (req, res) => {
    try {

        const latestReleases = await axios.post(`https://api.igdb.com/v4/games`,
            `fields id, name, cover.image_id, first_release_date;
                where first_release_date < ${Math.round(new Date().getTime() / 1000)};
                limit 10;
                sort first_release_date desc;`,
            {
                headers: {
                    "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                    "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                }

            })

        const latestRated = await axios.post(`https://api.igdb.com/v4/games`,
            `fields id, name, cover.image_id, aggregated_rating;
            where first_release_date < ${Math.round(new Date().getTime() / 1000)} & aggregated_rating >= 0;
            limit 10;
            sort first_release_date desc;`,
            {
                headers: {
                    "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                    "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                }

            })

        const comingSoon = await axios.post(`https://api.igdb.com/v4/games`,
            `fields id, name, cover.image_id, first_release_date;
            where first_release_date > ${Math.round(new Date().getTime() / 1000)};
            limit 10;
            sort first_release_date asc;`,
            {
                headers: {
                    "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                    "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                }

            })



        return res.json({
            latestReleases: [...latestReleases.data],
            latestRated: [...latestRated.data],
            comingSoon: [...comingSoon.data]
        })
    } catch (error) {
        console.error(error)
        return res.json({ latestReleases: [], latestRated: [], comingSoon: [] })
    }


})


router.get('/consoles/:console', async (req, res) => {
    try {

        if (map.hasOwnProperty(req.params.console)) req.params.console = map[req.params.console]


        const platform_res = await axios.post('https://api.igdb.com/v4/platforms',
            `fields name, versions.name, versions.companies, versions.summary, versions.companies.company.name, versions.platform_logo.image_id, versions.platform_version_release_dates.date;
             where slug = "${req.params.console}";`,
            {
                headers: {
                    "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                    "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                }

            })


        const console_data = {
            name: platform_res.data[0].name,
            logo: platform_res.data[0].versions[0].platform_logo.image_id,
            date: platform_res.data[0].versions[0].platform_version_release_dates[0].date,
            company: platform_res.data[0].versions.companies ? platform_res.data[0].versions[platform_res.data[0].versions.length - 1].companies[0].company.name : "N/A",
            summary: platform_res.data[0].versions[0].summary,

            other_versions: platform_res.data[0].versions.length > 1 ? [...platform_res.data[0].versions.slice(1)] : ["N/A"]
        }


        if (!isNaN(parseInt(console_data.company))) {
            const company_res = await axios.post('https://api.igdb.com/v4/companies',
                `fields name;
             where id = ${parseInt(console_data.company)};`,
                {
                    headers: {
                        "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                        "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                    }

                })
            console_data["company"] = company_res.data[0].name
        }

        if (req.params.console === "pc" || req.params.console === "win") {
            console_data["logo"] = platform_res.data[0].versions[platform_res.data[0].versions.length - 1].platform_logo.image_id
        }

        const latestReleases = await axios.post(`https://api.igdb.com/v4/games`,
            `fields id, name, cover.image_id, first_release_date;
                where first_release_date < ${Math.round(new Date().getTime() / 1000)} & platforms.slug = "${req.params.console}";
                limit 20;
                sort first_release_date desc;`,
            {
                headers: {
                    "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                    "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                }

            })

        const latestRated = await axios.post(`https://api.igdb.com/v4/games`,
            `fields id, name, cover.image_id, aggregated_rating;
            where first_release_date < ${Math.round(new Date().getTime() / 1000)} & aggregated_rating >= 0 & platforms.slug = "${req.params.console}";
            limit 20;
            sort first_release_date desc;`,
            {
                headers: {
                    "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                    "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                }

            })

        const comingSoon = await axios.post(`https://api.igdb.com/v4/games`,
            `fields id, name, cover.image_id, first_release_date;
            where first_release_date > ${Math.round(new Date().getTime() / 1000)} & platforms.slug = "${req.params.console}";
            limit 20;
            sort first_release_date asc;`,
            {
                headers: {
                    "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                    "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                }

            })


        return res.json({
            console_data,
            latestReleases: [...latestReleases.data],
            latestRated: [...latestRated.data],
            comingSoon: [...comingSoon.data]
        })

    } catch (error) {
        console.error(error)
        return res.json({ console_data: {}, latestReleases: [], latestRated: [], comingSoon: [] })
    }


})

router.get("/games/submenu/:type", async (req, res) => {

    try {

        if (req.params.type === "new-releases") {

            const latestReleases = await axios.post(`https://api.igdb.com/v4/games`,
                `fields id, name, cover.image_id, first_release_date;
                    where first_release_date < ${Math.round(new Date().getTime() / 1000)};
                    limit 49;
                    sort first_release_date desc;`,
                {
                    headers: {
                        "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                        "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                    }

                })


            return res.json({
                info: [...latestReleases.data]
            })

        }

        else if (req.params.type === "top-rated") {

            const topRated = await axios.post(`https://api.igdb.com/v4/games`,
                `fields id, name, cover.image_id, aggregated_rating;
                where first_release_date < ${Math.round(new Date().getTime() / 1000)} & aggregated_rating >= 0;
                limit 49;
                sort aggregated_rating desc;`,
                {
                    headers: {
                        "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                        "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                    }

                })

            return res.json({
                info: [...topRated.data]
            })
        }

        else if (req.params.type === "upcoming") {

            const comingSoon = await axios.post(`https://api.igdb.com/v4/games`,
                `fields id, name, cover.image_id, first_release_date;
                where first_release_date > ${Math.round(new Date().getTime() / 1000)};
                limit 49;
                sort first_release_date asc;`,
                {
                    headers: {
                        "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                        "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                    }

                })

            return res.json({
                info: [...comingSoon.data]
            })
        }

        return res.json({
            info: {}
        })

    } catch (error) {
        console.error(error)
        return res.json({ info: {} })
    }
})

router.get("/games/:game_id", async (req, res) => {

    try {

        const game_res = await axios.post("https://api.igdb.com/v4/games",
            `fields *, cover.*, artworks.*, platforms.*, involved_companies.company.*, screenshots.*;
             where id=${req.params.game_id};`,
            {
                headers: {
                    "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                    "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                }

            })


        return res.json({
            game: game_res.data[0]
        })

    } catch (error) {
        console.error(error)
        return res.json({ game: {} })
    }
})


router.get("/search/:query", async (req, res) => {

    // const { type } = req.body

    try {

        // if (type === "console") {
        const console_res = await axios.post('https://api.igdb.com/v4/platforms',
            `fields name, slug, versions.platform_logo.image_id;
                 search "${req.params.query}";
                 limit 50;`,
            {
                headers: {
                    "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                    "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                }

            })


        // return res.json({ results: response.data })
        // }

        // if (type === "game") {
        const game_res = await axios.post("https://api.igdb.com/v4/games",
            `fields id, name, cover.image_id, first_release_date;
                 search "${req.params.query}";
                 limit 50;`,
            {
                headers: {
                    "Client-ID": `${process.env.TWITCH_CLIENT_ID}`,
                    "Authorization": `Bearer ${process.env.TWITCH_TOKEN}`
                }

            })


        return res.json({ consoles: console_res.data, games: game_res.data })
        // }


    } catch (error) {
        console.error(error)
        return res.json({ results: {} })
    }


})







module.exports = router