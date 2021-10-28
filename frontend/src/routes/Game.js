import { Box, Button, Checkbox, CircularProgress, CircularProgressLabel, Grid, GridItem, Heading, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Spinner, Stack, Text, useDisclosure } from '@chakra-ui/react'
import axios from 'axios'
import { Carousel, CarouselItem } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useUserContext } from '../hooks/UserContext'
import { Field, Form, Formik } from 'formik'


export default function Game() {

    let { game_id } = useParams()

    const imgUrl = "https://images.igdb.com/igdb/image/upload/t_cover_med_2x/"
    const imgUrlScreen = "https://images.igdb.com/igdb/image/upload/t_screenshot_med_2x/"

    const [game, setgame] = useState({})
    const [release_date, setreleaseDate] = useState("N/A")
    const [platforms, setplatforms] = useState([])
    const [companies, setcompanies] = useState([])
    const [screenshots, setscreenshots] = useState([])
    const { loggedIn, user, setloggedIn, setuser } = useUserContext()
    const [lists, setlists] = useState([])
    // const [addListForm, setaddListForm] = useState(false)


    const { isOpen, onOpen, onClose } = useDisclosure()


    axios.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            if (error.response.status === 401) {
                setloggedIn(false)
                setuser(null)

                window.location.reload()

            }
            return Promise.reject(error)

        })


    useEffect(() => {
        const response = async () => {

            const r = await axios.get(`/api/igdb/games/${game_id}`)

            let d = new Date((r.data.game.first_release_date) * 1000)

            setgame(r.data.game)
            setreleaseDate(d.toDateString().slice(3))
            setplatforms(r.data.game.platforms)
            setcompanies(r.data.game.involved_companies)
            setscreenshots(r.data.game.screenshots)


            if (loggedIn && user) {
                const res = await axios.get(`/api/lists/${user.id}`)
                setlists([...res.data.lists])
            }

        }

        response()

        document.title = game.name ? `Gamer Site | ${game.name}` : "Gamer Site | Game"

        return () => {

        }
    }, [game_id, loggedIn])


    return (
        <div id="game-page">
            <Grid column={3} templateColumns="repeat(3, 1fr)">
                <GridItem colSpan={1}>
                    <Box className="game-info-card" borderWidth="2px" display="flex" flexDirection="column" maxWidth="20vw">
                        {
                            !game.cover ? (
                                <Box width="100px" height="100px" bgColor="gray.400">
                                    No Image Available
                                </Box>
                            ) : (
                                <Image src={`${imgUrl}${game.cover["image_id"]}.png`} />
                            )
                        }

                        <Box className="game-info">

                            <Heading className="game-info-data" fontSize="1.5rem">{game.name}</Heading>

                            {
                                game.first_release_date ? (

                                    <Text className="game-info-data">{release_date}</Text>
                                ) : (
                                    <Text className="game-info-data">N/A</Text>
                                )
                            }

                            {
                                (platforms) ? (

                                    <Text className="game-info-data" fontStyle="italic">({platforms.map((v, idx) => {
                                        if (idx < platforms.length - 1) return (`${v.name}, `)
                                        return (`${v.name}`)
                                    })})</Text>
                                ) : (
                                    <Spinner className="game-info-data" textAlign="center" />
                                )
                            }
                        </Box>

                    </Box>

                    {
                        loggedIn && lists.length > 0 ? (
                            <>
                                <Button my={4} onClick={onOpen}>Add to Lists</Button>
                                <Formik
                                    initialValues={{
                                        list_items: []
                                    }}
                                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                                        setSubmitting(true)


                                        const res = await axios.put(`/api/lists/${game_id}`, {
                                            name: game.name,
                                            lists: [...values.list_items]
                                        })

                                        resetForm()
                                        setSubmitting(false)
                                        onClose()

                                    }}
                                >
                                    <Modal motionPreset="scale" isOpen={isOpen} isCentered onClose={onClose}>
                                        <ModalContent>
                                            <ModalHeader>Add to Game Lists</ModalHeader>
                                            <ModalCloseButton />
                                            <Form>

                                                <ModalBody>
                                                    <Stack>

                                                        {
                                                            lists.map(v => (

                                                                <Field size="lg" name="list_items" value={v.id} as={Checkbox} >
                                                                    {v.name}
                                                                </Field>
                                                            ))
                                                        }

                                                    </Stack>

                                                    {/* {
                                                    addListForm ? (
                                                        <>
                                                            <Field as={Input} />
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )
                                                } */}

                                                </ModalBody>
                                                <ModalFooter>
                                                    {/* {
                                                    addListForm ? (
                                                        <></>
                                                    ) : (
                                                        <Button onClick={() => {
                                                            setaddListForm(true)
                                                        }}>
                                                            Create New Playlist
                                                        </Button>

                                                    )
                                                } */}
                                                    <Button type="submit" >
                                                        Add
                                                    </Button>
                                                </ModalFooter>
                                            </Form>
                                        </ModalContent>
                                    </Modal>
                                </Formik>

                            </>
                        ) : (
                            <>
                            </>
                        )
                    }

                </GridItem>
                <GridItem colSpan={1}>
                    <Box className="game-info" borderWidth="2px" display="flex" flexDirection="column" maxWidth="50vw">
                        <Heading className="game-info-data">
                            Publishers
                        </Heading>

                        {
                            companies ? (
                                <Text className="game-info-data">
                                    {companies.map((v, idx) => {
                                        if (idx < companies.length - 1) return (`${v.company.name}, `)
                                        return (`${v.company.name}`)
                                    })}
                                </Text>
                            ) : (
                                <Text className="game-info-data">
                                    {`N/A`}
                                </Text>
                            )
                        }
                    </Box>

                    <Box className="game-info" borderWidth="2px" display="flex" flexDirection="column" maxWidth="50vw">
                        <Heading className="game-info-data" as="h6">Description</Heading>
                        <Text className="game-info-data">
                            {game.summary}
                        </Text>
                    </Box>

                    <Box className="game-info" borderWidth="2px" display="flex" flexDirection="column" maxWidth="50vw">
                        <Heading className="game-info-data"> Screenshots</Heading>
                        {
                            screenshots.length > 0 ? (
                                <Carousel className="game-info-data">

                                    {screenshots.map((v, idx) => {
                                        return (
                                            <CarouselItem>

                                                <Image src={`${imgUrlScreen}${v.image_id}.png`} />
                                            </CarouselItem>
                                        )
                                    })}
                                </Carousel>
                            ) : (
                                <Text className="game-info-data">No images available.</Text>
                            )
                        }
                    </Box>
                </GridItem>
                <GridItem colSpan={1}>
                    <Box className="game-info" borderWidth="2px" display="flex" flexDirection="column" alignItems="center" mx="auto" maxWidth="20vw">
                        <Heading>
                            Score
                        </Heading>
                        {
                            game.aggregated_rating >= 0 ? (
                                <CircularProgress value={Math.floor(game.aggregated_rating)} color="purple.400" thickness="15px" size="100px">
                                    <CircularProgressLabel>{Math.floor(game.aggregated_rating)}%</CircularProgressLabel>
                                </CircularProgress>
                            ) : (
                                <Text>
                                    No Score Available.
                                </Text>
                            )
                        }
                    </Box>
                </GridItem>
            </Grid>


        </div>
    )
}
