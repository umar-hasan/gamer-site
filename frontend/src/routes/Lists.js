import { Box, Button, Heading, Modal, ModalContent, ModalBody, FormLabel, Image, Input, Table, Tbody, Td, Tr, useDisclosure } from '@chakra-ui/react'
import axios from 'axios'
import { ErrorMessage, Field, Formik, useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { useUserContext } from '../hooks/UserContext'

export default function Lists() {

    const { user_id } = useParams()
    const { loggedIn, user } = useUserContext()
    const formik = useFormik({

    })

    const [lists, setlists] = useState([])

    const { isOpen, onOpen, onClose } = useDisclosure()

    const imgUrl = "https://images.igdb.com/igdb/image/upload/t_cover_med_2x/"

    useEffect(() => {
        const setUpLists = async () => {
            const res = await axios.get(`/api/lists/${user_id}`)

            setlists([...res.data.lists])
        }

        console.log(typeof parseInt(user_id))
        return () => {
            setlists([])
        }
    }, [loggedIn])


    return (
        <div>
            {
                loggedIn && user.id === parseInt(user_id )? (
                    <>
                        <Heading>Your Game Lists</Heading>
                        <Button onClick={onOpen}>
                            Add Playlist
                        </Button>
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

                            onSubmit={(values, { setSubmitting, resetForm }) => {

                            }}
                        >

                            <Modal motionPreset="scale" isOpen={isOpen} onClose={() => {
                                onClose()
                                formik.resetForm({
                                    values: {name: "", description: ""},
                                    errors: {name: ""}
                                })
                            }}>
                                <ModalContent>
                                    <ModalBody>
                                        <FormLabel htmlFor="name">Name</FormLabel>
                                        <Field name="name" as={Input} />
                                        <ErrorMessage name="name" />

                                        <FormLabel htmlFor="description">Description</FormLabel>
                                        <Field name="description" as={Input} />
                                    </ModalBody>
                                </ModalContent>
                            </Modal>
                        </Formik>
                        <Table>
                            <Tbody>

                                {
                                    lists.map(v => (
                                        <Tr>
                                            <Td>
                                                {
                                                    v.games[0].img_url ? (
                                                        <Image src={v.games[0].img_url} />
                                                    ) : (
                                                        <Box backgroundColor="gray">
                                                            No Image Available
                                                        </Box>
                                                    )
                                                }
                                            </Td>
                                            <Td>
                                                {v.name}
                                            </Td>
                                            <Td>
                                                <Button>Delete</Button>
                                            </Td>
                                        </Tr>
                                    ))
                                }
                            </Tbody>
                        </Table>
                    </>
                ) : (
                    <Redirect to="/" />
                )
            }
        </div>
    )
}
