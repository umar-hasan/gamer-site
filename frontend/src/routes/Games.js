import { Grid, GridItem, Heading, Spinner } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import GameContainer from '../components/GameContainer'
import Home from './Home'

export default function Games({ type = "none" }) {

    const [info, setinfo] = useState({})

    const imgUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/"
    const imgUrlLg = "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/"

    useEffect(() => {

        document.title = "Gamer Site | Games"

        async function response() {
            const res = await axios.get(`/api/igdb/games/submenu/${type}`)


            setinfo(res.data.info)
        }

        response()

        return () => {
            setinfo({})
        }
    }, [type])

    if (type === "new-releases") {
        return (
            <div>
                <div className="game-grid-container">
                    <Heading as="h2">Newest Releases</Heading>
                    {
                        info.length > 0 ? (
                            <div>
                                <div className="game-grid" >
                                    <Grid w="60%" templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={20}>

                                        <GridItem colSpan={2} rowSpan={2}>
                                            <GameContainer id={info[0].id}
                                                image={info[0].hasOwnProperty("cover") ? `${imgUrlLg}${info[0].cover.image_id}.jpg` : ""}
                                                title={info[0].name}
                                                info={{ release: info[0].first_release_date }} />

                                        </GridItem>
                                        {info.slice(1, 7).map((v) => {
                                            return (
                                                <GridItem colSpan={1}>
                                                    <GameContainer className="section-2"
                                                        id={v.id}
                                                        image={v.hasOwnProperty("cover") ? `${imgUrl}${v.cover.image_id}.jpg` : ""}
                                                        title={v.name}
                                                        info={{ release: v.first_release_date }} />
                                                </GridItem>
                                            )
                                        })}
                                    </Grid>


                                </div>
                                <Grid w="60%" templateRows="repeat(14, 1fr)" templateColumns="repeat(3, 1fr)" margin="auto" my={6} gap={20}>
                                    {info.slice(7).map(v => {
                                        return (
                                            <GridItem colSpan={1}>
                                                <GameContainer className="section-2"
                                                    id={v.id}
                                                    image={v.hasOwnProperty("cover") ? `${imgUrl}${v.cover.image_id}.jpg` : ""}
                                                    title={v.name}
                                                    info={{ release: v.first_release_date }} />
                                            </GridItem>
                                        )
                                    })}
                                </Grid>
                            </div>
                        ) : (
                            <div className="no-data">
                                <Spinner color="black" size="xl" thickness="10px" width="100px" height="100px" textAlign="center" />
                            </div>
                        )
                    }


                </div>
            </div>
        )
    }

    if (type === "top-rated") {
        return (
            <div>
                <div className="game-grid-container">
                    <Heading as="h2">Top Rated</Heading>
                    {info.length > 0 ? (
                        <div>
                            <div className="game-grid">
                                <Grid w="60%" templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={20}>
                                    <GridItem colSpan={2} rowSpan={2}>
                                        <GameContainer id={info[0].id}
                                            image={info[0].hasOwnProperty("cover") ? `${imgUrlLg}${info[0].cover.image_id}.jpg` : ""}
                                            title={info[0].name}
                                            info={{ score: info[0].aggregated_rating }} />
                                    </GridItem>
                                    {info.slice(1, 7).map((v) => {
                                        return (
                                            <GridItem colSpan={1}>
                                                <GameContainer className="section-2"
                                                    id={v.id}
                                                    image={v.hasOwnProperty("cover") ? `${imgUrl}${v.cover.image_id}.jpg` : ""}
                                                    title={v.name}
                                                    info={{ score: v.aggregated_rating }} />
                                            </GridItem>
                                        )
                                    })}
                                </Grid>
                            </div>
                            <Grid w="60%" templateRows="repeat(14, 1fr)" templateColumns="repeat(3, 1fr)" margin="auto" my={6} gap={20}>
                                {info.slice(7).map((v) => {
                                    return (
                                        <GridItem colSpan={1}>
                                            <GameContainer className="section-2"
                                                id={v.id}
                                                image={v.hasOwnProperty("cover") ? `${imgUrl}${v.cover.image_id}.jpg` : ""}
                                                title={v.name}
                                                info={{ score: v.aggregated_rating }} />
                                        </GridItem>
                                    )
                                })}
                            </Grid>
                        </div>
                    ) : (
                        <div className="no-data">
                            <Spinner color="black" size="xl" thickness="10px" width="100px" height="100px" textAlign="center" />
                        </div>
                    )}

                </div>
            </div>
        )
    }

    if (type === "upcoming") {
        return (
            <div>
                <div className="game-grid-container">
                    <Heading as="h2">Coming Soon</Heading>
                    {info.length > 0 ? (
                        <div>
                            <div className="game-grid">
                                <Grid w="60%" templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={20}>
                                    <GridItem colSpan={2} rowSpan={2}>
                                        <GameContainer id={info[0].id}
                                            image={info[0].hasOwnProperty("cover") ? `${imgUrlLg}${info[0].cover.image_id}.jpg` : ""}
                                            title={info[0].name}
                                            info={{ release: info[0].first_release_date }} />
                                    </GridItem>
                                    {info.slice(1, 7).map((v) => {
                                        return (
                                            <GridItem colSpan={1}>
                                                <GameContainer className="section-2"
                                                    id={v.id}
                                                    image={v.hasOwnProperty("cover") ? `${imgUrl}${v.cover.image_id}.jpg` : ""}
                                                    title={v.name}
                                                    info={{ release: v.first_release_date }} />
                                            </GridItem>
                                        )
                                    })}
                                </Grid>
                            </div>
                            <Grid w="60%" templateRows="repeat(14, 1fr)" templateColumns="repeat(3, 1fr)" margin="auto" my={6} gap={20}>
                                {info.slice(7).map((v) => {
                                    return (
                                        <GridItem colSpan={1}>
                                            <GameContainer className="section-2"
                                                id={v.id}
                                                image={v.hasOwnProperty("cover") ? `${imgUrl}${v.cover.image_id}.jpg` : ""}
                                                title={v.name}
                                                info={{ release: v.first_release_date }} />
                                        </GridItem>
                                    )
                                })}
                            </Grid>
                        </div>
                    ) : (
                        <div className="no-data">
                            <Spinner color="black" size="xl" thickness="10px" width="100px" height="100px" textAlign="center" />
                        </div>
                    )}

                </div>
            </div>
        )
    }

    return (
        <div>
            <Home />
        </div>
    )
}
