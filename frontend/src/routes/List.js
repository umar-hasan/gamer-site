import { Button, Heading, FormLabel, Input, Image, Table, Td, Tr, Text, Textarea, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import axios from 'axios'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { useUserContext } from '../hooks/UserContext'

export default function List() {

    const { list_id } = useParams()
    const { loggedIn, user, setuser, setloggedIn } = useUserContext()
    const [list, setlist] = useState({})
    const [games, setgames] = useState([])

    const { isOpen, onOpen, onClose } = useDisclosure()

    const history = useHistory()

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

        document.title = "Gamer Site | List"

        const listData = async () => {
            try {
                if (!user) throw new Error("User not logged in.")

                const res = await axios.get(`/api/lists/${user.id}/${list_id}`)

                setlist(res.data.list)
                setgames([...res.data.list.games])
            } catch (error) {
                history.goBack()
            }

        }

        listData()

        return () => {

        }
    }, [loggedIn, list_id])

    const deleteList = async (list_id) => {
        try {
            if (!user) throw new Error("User not logged in.")
            const res = await axios.delete(`/api/lists/${user.id}/${list_id}`)

            if (res.data.updated_list) {
                setgames([...res.data.updated_list])
            }

            history.push(`/users/${user.id}/lists`)

        } catch (error) {
            if (error.message === "User not logged in.") {
                history.push("/login")
            }
            history.push(`/users/${user.id}/lists`)
        }
    }

    const deleteGame = async (game_id) => {
        try {
            if (!user) throw new Error("User not logged in.")
            const res = await axios.delete(`/api/lists/${user.id}/${list_id}/${game_id}`)

            if (res.data.updated_list) {
                setgames([...res.data.updated_list.games])
            }

        } catch (error) {
            if (error.message === "User not logged in.") {
                history.push("/login")
            }
            history.push(`/users/${user.id}/lists`)
        }
    }

    return (
        <div>
            <Heading my={2} ml={2}>{list.name}</Heading>
            <Text my={2} ml={2}>
                {list.description}
            </Text>
            <Button my={2} mx={2} onClick={onOpen}>Edit List Info</Button>
            <Button my={2} mx={2} onClick={() => { deleteList(list.id) }}>Delete List</Button>

            <Formik
                enableReinitialize
                initialValues={{
                    name: list.name,
                    description: list.description
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

                        const res = await axios.put(`/api/lists/${user.id}/${list_id}`, {
                            name: values.name,
                            description: values.description
                        })

                        setlist(res.data.list)
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
                                values: {
                                    name: list.name,
                                    description: list.description
                                },
                                errors: {
                                    name: ""
                                }
                            })
                            setErrors({ name: "" })

                            onClose()
                        }}>
                            <Form>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Edit List Info</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <FormLabel htmlFor="name">Name</FormLabel>
                                        <Field name="name" as={Input} />
                                        <ErrorMessage name="name" />

                                        <FormLabel htmlFor="description">Description</FormLabel>
                                        <Field name="description" as={Textarea} />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button type="submit">Update</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Form>
                        </Modal>
                }
            </Formik>
            {
                games.length > 0 ?
                    (<Table w="90%" margin="auto">
                        {
                            games.map(game =>
                                <Tr>
                                    <Td width="200px">
                                        <Image width="100px" src={game.img_url} />
                                    </Td>
                                    <Td>
                                        <Link to={`/games/${game.id}`}>
                                            {game.name}
                                        </Link>
                                    </Td>
                                    <Td>
                                        <Button onClick={() => { deleteGame(game.id) }}>Delete</Button>

                                    </Td>
                                </Tr>
                            )}
                    </Table>
                    ) : (
                        <Text mx={2}>List is empty.</Text>
                    )
            }
        </div>
    )
}
