import { FormControl, Input, Button, FormLabel, Heading, Box } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { Form, Field, Formik, ErrorMessage } from 'formik'
import axios from 'axios'
import { Redirect, useHistory } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import { useUserContext } from '../hooks/UserContext'

export default function Login() {

    const history = useHistory()

    const { loggedIn, setloggedIn } = useUserContext()

    if (loggedIn) {
        return (
            <Redirect to="/" />
        )
    }

    return (
        <div>
            <Box id="login-card">
                <Heading textAlign="center">Sign In</Heading>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validate={(values) => {
                        const errors = {}
                        if (!values.username) {
                            errors.username = "Please enter a valid username."
                        }
                        if (!values.password) {
                            errors.password = "Please enter a valid password."
                        }

                        if (values.username && values.password) {
                            // const res = await axios.post("/api/users/login", {
                            //     username: values.username,
                            //     password: values.password
                            // })

                            // if (res.status === 200) {
                            //     setloggedIn(true)
                            //     return (
                            //         <Redirect to='/' />
                            //     )
                            // }


                        }

                        return errors
                    }}
                    onSubmit={async (values, { setSubmitting, resetForm, setFieldError }) => {
                        setSubmitting(true)
                        try {
                            const res = await axios.post("/api/users/login", {
                                username: values.username,
                                password: values.password
                            })

                            if (res.status === 200) {
                                setSubmitting(false)
                                resetForm()
                                setloggedIn(true)
                                history.goBack()
                            }

                        } catch (error) {

                            if (error.response.status === 500) {
                                if (error.response.data.message === "Invalid password.") {
                                    setFieldError("password", "Invalid password.")
                                }
                                if (error.response.data.message === "Invalid username.") {
                                    setFieldError("username", "Invalid username.")
                                }
                            }

                        }

                        setSubmitting(false)
                    }}
                >
                    {({
                        values,
                        errors,
                        isSubmitting,
                    }) => (

                        <Form>
                            <div className="form-field" >
                                <FormLabel htmlFor="username">Username</FormLabel>
                                <Field name="username" as={Input} />
                                <ErrorMessage name="username" />
                            </div>
                            <div className="form-field">
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <Field name="password" type="password" as={Input} />
                                <ErrorMessage name="password" />
                            </div>
                            <div className="form-field">
                                <Button type="submit" width="100%" disabled={isSubmitting}>Login</Button>
                            </div>
                        </Form>
                    )}
                </Formik>

            </Box>

            <p id="under-login">Don't have an account? <a style={{ color: 'blue' }} href="/register">Sign up.</a></p>
        </div>
    )
}
