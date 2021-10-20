const request = require('supertest');
const app = require('../../src/server');
const axios = require('axios')

const { setupTest } = require('../_beforeTest');


jest.mock('axios', () => ({
    post: (url, str, headers) => ({
        data: [
            {
                name: "game 1",
                versions: [{
                    platform_logo: {
                        image_id: ""
                    },
                    platform_version_release_dates: [
                        {
                            date: 12345678
                        }
                    ],
                    summary: "",
                    company: "N/A"
                }]
            }, "game 2", "game 3"
        ]
    })
}))

describe('tests IGDB routes', () => {

    test('data for homepage', async () => {
        const res = await request(app).get("/api/igdb/home")
        expect(res.status).toBe(200)


        expect(res.body).toEqual(expect.objectContaining({
            latestReleases: expect.arrayContaining(["game 2", "game 3"]),
            latestRated: expect.arrayContaining(["game 2", "game 3"]),
            comingSoon: expect.arrayContaining(["game 2", "game 3"])
        }))
    })

    test('console data', async () => {
        const res = await request(app).get("/api/igdb/consoles/switch")
        expect(res.status).toBe(200)

        console.log(res.body)

        expect(res.body).toEqual(expect.objectContaining({
            latestReleases: expect.arrayContaining(["game 2", "game 3"]),
            latestRated: expect.arrayContaining(["game 2", "game 3"]),
            comingSoon: expect.arrayContaining(["game 2", "game 3"]),
            console_data: expect.arrayContaining([
                expect.objectContaining({
                    name: "game 1",
                    versions: [{
                        platform_logo: {
                            image_id: ""
                        },
                        platform_version_release_dates: [
                            {
                                date: 12345678
                            }
                        ],
                        summary: ""
                    }]
                })])
        }))
    })

    test('submenu data', async () => {
        const res = await request(app).get("/api/igdb/games/submenu/new-releases")
        expect(res.status).toBe(200)
        expect(res.body).toEqual(expect.objectContaining({
            latestReleases: expect.arrayContaining(["game 2", "game 3"])
        }))
    })


})
