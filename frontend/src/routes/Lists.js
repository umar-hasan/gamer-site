import { Box, Button, Heading, Modal, ModalContent, ModalBody, ModalFooter, FormLabel, Input, Textarea, useDisclosure, SimpleGrid, ModalHeader, ModalOverlay, ModalCloseButton } from '@chakra-ui/react'
import axios from 'axios'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'
import ListContainer from '../components/ListContainer'
import { useUserContext } from '../hooks/UserContext'

export default function Lists() {

    const { user_id } = useParams()
    const { loggedIn, user, setuser, setloggedIn } = useUserContext()
    const history = useHistory()

    const [lists, setlists] = useState([])

    const { isOpen, onOpen, onClose } = useDisclosure()

    const imgUrl = "https://images.igdb.com/igdb/image/upload/t_cover_med_2x/"

    axios.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            if (error.response.status === 401) {
                setuser(null)
                setloggedIn(false)
                history.push("/login")
            }
            return Promise.reject(error)

        })

    useEffect(() => {

        const setUpLists = async () => {
            try {
                const res = await axios.get(`/api/lists/${user_id}`)

                setlists([...res.data.lists])


            } catch (error) {
                setlists([])
            }
        }


        setUpLists()

        return () => {
            setlists([])
        }
    }, [loggedIn])


    return (
        <div>
            {
                <>
                    <Box textAlign="center">

                        <Heading my={3}>Your Game Lists</Heading>
                        <Button my={3} onClick={onOpen}>
                            Add Playlist
                        </Button>
                    </Box>
                    <Formik
                        initialValues={{
                            name: "",
                            description: ""
                        }}
                        validate={(values) => {
                            const errors = {}

                            if (!values.name) {
                                errors.name = "You need to identify this list!"
                            }

                            return errors
                        }}

                        onSubmit={async (values, { setSubmitting, resetForm }) => {

                            setSubmitting(true)

                            try {

                                const res = await axios.post("/api/lists/", {
                                    name: values.name,
                                    description: values.description
                                })

                                let l = lists

                                setlists([...l, res.data.list])
                            } catch (error) {
                                console.error(error)
                            }

                            resetForm()
                            setSubmitting(false)

                            onClose()
                        }}


                    >

                        {
                            ({ resetForm, setErrors }) =>

                                <Modal motionPreset="scale" isOpen={isOpen} onClose={() => {
                                    resetForm({
                                        values: { name: "", description: "" },
                                        errors: { name: "" }
                                    })
                                    setErrors({
                                        name: ""
                                    })
                                    onClose()
                                }}>
                                    <Form>

                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>Create a New Game List</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                <FormLabel htmlFor="name">Name</FormLabel>
                                                <Field name="name" as={Input} />
                                                <ErrorMessage name="name" />

                                                <FormLabel htmlFor="description">Description</FormLabel>
                                                <Field name="description" as={Textarea} />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button type="submit">Create</Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Form>
                                </Modal>

                        }

                    </Formik>

                    <SimpleGrid w="90%" minChildWidth="300px" gridTemplateColumns="repeat(4, 300px)" spacing="20px" mx="auto" my={2}>
                        {
                            lists.map(v =>
                                <Link to={`/lists/${v.id}`}>
                                    <ListContainer img={v.games.length > 0 ? v.games[0].img_url : null} name={v.name} description={v.description} />
                                </Link>
                            )
                        }
                    </SimpleGrid>
                </>
            }
        </div>
    )
}
