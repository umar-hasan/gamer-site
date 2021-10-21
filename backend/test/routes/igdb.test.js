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

    test('1. data for homepage', async () => {
        const res = await request(app).get("/api/igdb/home")
        expect(res.status).toBe(200)


        expect(res.body).toEqual(expect.objectContaining({
            latestReleases: expect.arrayContaining(["game 2", "game 3"]),
            latestRated: expect.arrayContaining(["game 2", "game 3"]),
            comingSoon: expect.arrayContaining(["game 2", "game 3"])
        }))
    })

    test('2. console data', async () => {
        const res = await request(app).get("/api/igdb/consoles/switch")
        expect(res.status).toBe(200)

        console.log(res.body)

        expect(res.body).toEqual({
            latestReleases: [{
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
            }, "game 2", "game 3"],
            latestRated: [{
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
            }, "game 2", "game 3"],
            comingSoon: [{
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
            }, "game 2", "game 3"],
            console_data:
            {
                company: "N/A",
                name: "game 1",
                date: 12345678,
                logo: "",
                summary: "",
                other_versions: ["N/A"]
            }
        })
    })

    test('3. submenu data', async () => {
        const res = await request(app).get("/api/igdb/games/submenu/new-releases")
        expect(res.status).toBe(200)
        expect(res.body).toEqual({
            info: expect.arrayContaining(["game 2", "game 3"])
        })
    })


})
