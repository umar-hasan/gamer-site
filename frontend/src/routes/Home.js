import GameContainer from '../components/GameContainer'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Grid, GridItem, Heading, Spinner } from '@chakra-ui/react'

export default function Home(props) {

    const [latestReleases, setlatestReleases] = useState([{}])
    const [latestRated, setlatestRated] = useState([{}])
    const [comingSoon, setcomingSoon] = useState([{}])

    const imgUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big/"
    const imgUrlLg = "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/"

    useEffect(() => {
        document.title = "Gamer Site | Home"
        const response = async () => {

            try {
                
                const r = await axios.get('/api/igdb/home')
    
                setlatestReleases([...r.data.latestReleases])
                setlatestRated([...r.data.latestRated])
                setcomingSoon([...r.data.comingSoon])
            } catch (error) {
                setlatestReleases([{}])
                setlatestRated([{}])
                setcomingSoon([{}])
            }

        }

        response()

    }, [])




    return (
        <div>
            <div className="game-grid-container">
                <Heading as="h2">Newest Releases</Heading>
                {
                    latestReleases.length > 0 ? (
                        <div className="game-grid">
                            <Grid w="60%" templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={20}>

                                <GridItem colSpan={2} rowSpan={2}>
                                    <GameContainer id={latestReleases[0].id}
                                        image={latestReleases[0].hasOwnProperty("cover") ? `${imgUrlLg}${latestReleases[0].cover.image_id}.jpg` : ""}
                                        title={latestReleases[0].name}
                                        info={{ release: latestReleases[0].first_release_date }} />

                                </GridItem>
                                {latestReleases.slice(1, 7).map((v) => {
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
                                {/* {latestReleases.slice(5).map((v) => {
                                    return (
                                        <GridItem colSpan={1}>
                                            <GameContainer key={v.id}
                                                image={v.hasOwnProperty("cover") ? `${imgUrl}${v.cover.image_id}.jpg` : ""}
                                                title={v.name}
                                                info={{ release: v.first_release_date }} />
                                        </GridItem>
                                    )
                                })} */}
                            </Grid>

                        </div>

                    ) : (
                        <div className="no-data">
                            <Spinner color="black" size="xl" thickness="10px" width="100px" height="100px" textAlign="center" />
                        </div>
                    )
                }


            </div>

            <div className="game-grid-container">
                <Heading as="h2">Recently Reviewed</Heading>
                {latestRated.length > 0 ? (

                    <div className="game-grid">
                        <Grid w="60%" templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={20}>
                            <GridItem colSpan={2} rowSpan={2}>
                                <GameContainer id={latestRated[0].id}
                                    image={latestRated[0].hasOwnProperty("cover") ? `${imgUrlLg}${latestRated[0].cover.image_id}.jpg` : ""}
                                    title={latestRated[0].name}
                                    info={{ score: latestRated[0].aggregated_rating }} />
                            </GridItem>
                            {latestRated.slice(1, 7).map((v) => {
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
                            {/* {latestRated.slice(5).map((v) => {
                                return (
                                    <GridItem colSpan={1}>
                                        <GameContainer key={v.id}
                                            image={v.hasOwnProperty("cover") ? `${imgUrl}${v.cover.image_id}.jpg` : ""}
                                            title={v.name}
                                            info={{ score: v.aggregated_rating }} />
                                    </GridItem>
                                )
                            })} */}
                        </Grid>
                    </div>
                ) : (
                    <div className="no-data">
                        <Spinner color="black" size="xl" thickness="10px" width="100px" height="100px" textAlign="center" />
                    </div>
                )}

            </div>

            <div className="game-grid-container">
                <Heading as="h2">Coming Soon</Heading>
                {comingSoon.length > 0 ? (
                    <div className="game-grid">
                        <Grid w="60%" templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)" gap={20}>
                            <GridItem colSpan={2} rowSpan={2}>
                                <GameContainer id={comingSoon[0].id}
                                    image={comingSoon[0].hasOwnProperty("cover") ? `${imgUrlLg}${comingSoon[0].cover.image_id}.jpg` : ""}
                                    title={comingSoon[0].name}
                                    info={{ release: comingSoon[0].first_release_date }} />
                            </GridItem>
                            {comingSoon.slice(1, 7).map((v) => {
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
                            {/* {comingSoon.slice(5).map((v) => {
                                return (
                                    <GridItem colSpan={1}>
                                        <GameContainer key={v.id}
                                            image={v.hasOwnProperty("cover") ? `${imgUrl}${v.cover.image_id}.jpg` : ""}
                                            title={v.name}
                                            info={{ release: v.first_release_date }} />
                                    </GridItem>
                                )
                            })} */}
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
