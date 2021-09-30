import { Box, Button, FormLabel, Grid, GridItem, Heading, Input } from '@chakra-ui/react'
import axios from 'axios'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { useUserContext } from '../hooks/UserContext'

export default function Register() {

    const history = useHistory()

    const { loggedIn, setloggedIn } = useUserContext()

    return (
        <div>
            {
                !loggedIn ? (

                    <Box>
                        <Heading textAlign="center" my="50px">
                            Sign Up
                        </Heading>
                        <Formik
                            initialValues={{
                                username: "",
                                password: "",
                                confirm_password: "",
                                first_name: "",
                                last_name: ""
                            }}
                            validate={(values) => {
                                const errors = {}
                                if (!values.username) {
                                    errors.username = "Please enter a username."
                                }
                                if (!values.password) {
                                    errors.password = "Please enter a password."
                                }
                                if (!values.confirm_password) {
                                    errors.confirm_password = "Please confirm your password."
                                }
                                if (!values.first_name) {
                                    errors.first_name = "Please enter your first name."
                                }
                                if (!values.last_name) {
                                    errors.last_name = "Please enter your last name."
                                }

                                if (values.password && values.password.length < 8) {
                                    errors.password = "Password should be at least 8 characters long."
                                }

                                if (values.password && values.confirm_password &&
                                    values.password !== values.confirm_password) {
                                    errors.confirm_password = "This needs to match the password you entered."
                                }


                                return errors
                            }}
                            onSubmit={async (values, { setSubmitting, resetForm, setFieldError }) => {
                                setSubmitting(true)
                                try {

                                    const res = await axios.post('/api/users/register', {
                                        username: values.username,
                                        password: values.password,
                                        first_name: values.first_name,
                                        last_name: values.last_name
                                    })

                                    if (res.status === 200) {
                                        setSubmitting(false)
                                        resetForm()
                                        history.push("/login")
                                    }


                                } catch (error) {
                                    if (error.response.status === 500 && error.response.data.message === "This user already exists!") {
                                        setFieldError("username", "This username already exists!")
                                    }
                                }

                                setSubmitting(false)

                            }}
                        >
                            <Form>
                                <Grid templateRows="repeat(6, 1fr)" templateColumns="repeat(2, 1fr)" gap={5} width="80%" mx="auto">
                                    <GridItem rowSpan={1} colSpan={1}>
                                        <FormLabel>First Name</FormLabel>
                                        <Field name="first_name" as={Input} />
                                        <ErrorMessage name="first_name" />
                                    </GridItem>
                                    <GridItem rowSpan={1} colSpan={1}>
                                        <FormLabel>Last Name</FormLabel>
                                        <Field name="last_name" as={Input} />
                                        <ErrorMessage name="last_name" />
                                    </GridItem>
                                    <GridItem rowSpan={1} colSpan={2}>
                                        <FormLabel>Username</FormLabel>
                                        <Field name="username" as={Input} />
                                        <ErrorMessage name="username" />
                                    </GridItem>
                                    <GridItem rowSpan={1} colSpan={2}>
                                        <FormLabel>Password</FormLabel>
                                        <Field name="password" type="password" as={Input} />
                                        <ErrorMessage name="password" />
                                    </GridItem>
                                    <GridItem rowSpan={1} colSpan={2}>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <Field name="confirm_password" type="password" as={Input} />
                                        <ErrorMessage name="confirm_password" />
                                    </GridItem>
                                    <GridItem rowSpan={1} colSpan={2}>
                                        <Button type="submit">Register</Button>
                                    </GridItem>

                                </Grid>
                            </Form>
                        </Formik>
                    </Box>
                ) : (
                    <Redirect to="/"/>
                )
            }
        </div>
    )
}
