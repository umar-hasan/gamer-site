import { Box, Center, Container, Grid, GridItem, Heading, HStack, Image, SimpleGrid, Spinner, Stat, StatHelpText, StatLabel, Text, VStack } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GameContainer from '../components/GameContainer'

import { latest } from '../latest'

export default function Console() {

    let { console_slug } = useParams()

    const imgUrlLogo = "https://images.igdb.com/igdb/image/upload/t_cover_big/"
    const imgUrl = "https://images.igdb.com/igdb/image/upload/t_cover_small/"
    const imgUrlLg = "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/"



    const [latestReleases, setlatestReleases] = useState([{}])
    const [latestRated, setlatestRated] = useState([{}])
    const [comingSoon, setcomingSoon] = useState([{}])
    const [console_data, setconsoleData] = useState({})
    const [other_versions, setotherVersions] = useState([])
    const [grid, setgrid] = useState(true)

    useEffect(() => {
        async function getItems() {
            const res = await axios.get(`/api/igdb/consoles/${console_slug}`)

            setconsoleData(res.data.console_data)
            setotherVersions(res.data.console_data.other_versions ?
                [...res.data.console_data.other_versions] : [])
            setlatestReleases([...res.data.latestReleases])
            setlatestRated([...res.data.latestRated])
            setcomingSoon([...res.data.comingSoon])

        }

        getItems()


        return () => {
            setconsoleData({})
            setlatestReleases([{}])
            setlatestRated([{}])
            setcomingSoon([{}])

        }

    }, [console_slug])




    return (
        <div>
            {
                console_data.logo !== null ? (

                    <Center className="console-logo">
                        <Image src={`${imgUrlLogo}${console_data.logo}.png`} />
                    </Center>
                ) : (
                    <Spinner />
                )
            }


            {/* <Container>
                <Text>
                    {console_data["summary"]}
                </Text>
            </Container> */}

            {/* <Center>
                {
                    console_data !== null ? (

                        <Container  display="flex" justifyContent="center" my="30px" px="30px" py="20px" maxWidth="fit-content" bgColor="gray.100">
                            <VStack spacing={10}>
                                <Center>
                                    <Heading as="h1">{console_data["name"]}</Heading>
                                </Center>

                                <HStack spacing={100} mx="auto">

                                    <Box>

                                        <Stat>
                                            <StatLabel>Initial Release Date</StatLabel>
                                            <StatHelpText>{(new Date(1000 * (console_data["date"] + 86400))).toLocaleDateString("en-US")}</StatHelpText>
                                        </Stat>
                                    </Box>

                                    <Box >
                                        <Stat>
                                            <StatLabel>Publisher</StatLabel>
                                            <StatHelpText>{console_data["company"]}</StatHelpText>
                                        </Stat>
                                    </Box>

                                    {

                                    }
                                    <Box>
                                        <Stat>
                                            <StatLabel>Other Versions</StatLabel>
                                            {
                                                !other_versions ? (
                                                    <StatHelpText>{other_versions.map((v, idx)=> {
                                                        if (idx < other_versions.length - 1) return (`${v.name}, `)
                                                        return (`${v.name}`)
                                                    })}</StatHelpText>
                                                ) : (
                                                    <StatHelpText>N/A</StatHelpText>
                                                )
                                            }

                                        </Stat>
                                    </Box>

                                </HStack>
                            </VStack>


                        </Container>
                    ) : (
                        <Spinner />
                    )
                }
            </Center> */}

            {
                latest.has(console_slug) ? (

                    <Grid className="game-columns" display="flex" w="90%" column={3} row={1} gap={10} my="50px">

                        <GridItem className="game-grid-list-container" width="100%" colSpan={1}>
                            <Heading as="h4" my="30px">Latest Releases</Heading>
                            {
                                latestReleases.length > 0 ? (
                                    <div className="game-grid">
                                        <Grid w="100%" templateRows="repeat(10, 1fr)" templateColumns="repeat(1, 1fr)" gap={10}>

                                            {latestReleases.map((v) => {
                                                return (
                                                    <GridItem rowSpan={1}>
                                                        <GameContainer className="section-2"
                                                            id={v.id}
                                                            image={v.hasOwnProperty("cover") ? `${imgUrl}${v.cover.image_id}.jpg` : ""}
                                                            title={v.name}
                                                            info={{ release: v.first_release_date }}
                                                            box={false} />
                                                    </GridItem>
                                                )
                                            })}
                                        </Grid>

                                    </div>

                                ) : (
                                    <div>
                                        <Spinner />
                                    </div>
                                )
                            }


                        </GridItem>

                        <GridItem className="game-grid-list-container" width="100%" colSpan={1}>
                            <Heading as="h4" my="30px">Recently Reviewed</Heading>
                            {latestRated.length > 0 ? (

                                <div className="game-grid">
                                    <Grid w="100%" templateRows="repeat(10, 1fr)" templateColumns="repeat(1, 1fr)" gap={10}>

                                        {latestRated.map((v) => {
                                            return (
                                                <GridItem rowSpan={1}>
                                                    <GameContainer className="section-2"
                                                        id={v.id}
                                                        image={v.hasOwnProperty("cover") ? `${imgUrl}${v.cover.image_id}.jpg` : ""}
                                                        title={v.name}
                                                        info={{ score: v.aggregated_rating }}
                                                        box={false} />
                                                </GridItem>
                                            )
                                        })}
                                    </Grid>
                                </div>
                            ) : (
                                <div>
                                    <Spinner />
                                </div>
                            )}

                        </GridItem>

                        <GridItem className="game-grid-list-container" width="100%" colSpan={1}>
                            <Heading as="h4" my="30px">Coming Soon</Heading>
                            {comingSoon.length > 0 ? (
                                <div className="game-grid">
                                    <Grid w="100%" templateRows="repeat(10, 1fr)" templateColumns="repeat(1, 1fr)" gap={10}>

                                        {comingSoon.map((v) => {
                                            return (
                                                <GridItem rowSpan={1}>
                                                    <GameContainer className="section-2"
                                                        id={v.id}
                                                        image={v.hasOwnProperty("cover") ? `${imgUrl}${v.cover.image_id}.jpg` : ""}
                                                        title={v.name}
                                                        info={{ release: v.first_release_date }}
                                                        box={false} />
                                                </GridItem>
                                            )
                                        })}
                                    </Grid>
                                </div>
                            ) : (
                                <div>

                                    <Spinner />
                                </div>
                            )}

                        </GridItem>
                    </Grid>
                ) : (
                    <>
                    <Heading>Games</Heading>
                    <Grid templateRows="repeat(10, 1fr)" templateColumns="repeat(3, 1fr)" >
                        {latestReleases.map(v => {
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
                    </>
                )
            }


        </div>
    )
}
