import { FormLabel } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import axios from 'axios'
import { Col, Container, ListGroup, ListGroupItem, Nav, NavItem, NavLink, Row, Spinner, TabContainer, TabContent, TabPane } from 'react-bootstrap'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { SettingsPane } from 'react-settings-pane'
import SettingsContent from 'react-settings-pane/lib/SettingsContent'
import SettingsPage from 'react-settings-pane/lib/SettingsPage'
import { useUserContext } from '../hooks/UserContext'
import { Grid, GridItem } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'
import { Heading } from '@chakra-ui/react'

export default function Settings() {

    const { loggedIn, user, checkUserCookie, setloggedIn, setuser } = useUserContext()

    const [userInfo, setuserInfo] = useState(null)


    useEffect(() => {


        if (!checkUserCookie()) {
            setloggedIn(false)
            setuser(null)

        }


        try {

            const getInfo = async () => {
                if (user) {

                    const res = await axios.get(`/api/users/${user.id}`)
                    setuserInfo(res.data.user)

                    console.log("----------")
                    console.log(userInfo)
                }

            }

            getInfo()


        } catch (error) {

        }

        return () => {

        }
    }, [loggedIn, user])

    const menu = [
        {
            title: "User Info",
            url: "/settings/info"
        },
        {
            title: "Change Password",
            url: "/settings/change-password"
        }
    ]

    return (
        <div>

            {
                loggedIn && user ? (

                    <Container className="my-5">
                        {
                            userInfo ? (

                                <TabContainer id="settings-container" variant="flush" defaultActiveKey="user-info">
                                    <Row>
                                        <Col sm={3}>
                                            <Heading>Settings</Heading>
                                            <Nav id="settings-tabs" className="flex-column" variant="pills">
                                                <NavItem>
                                                    <NavLink eventKey="user-info">User Information</NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink eventKey="change-password">Change Password</NavLink>
                                                </NavItem>
                                            </Nav>

                                        </Col>

                                        <Col sm={9}>
                                            <TabContent>
                                                <TabPane eventKey="user-info">
                                                    <Formik
                                                        initialValues={{
                                                            username: userInfo.username,
                                                            password: "",
                                                            first_name: userInfo.firstName,
                                                            last_name: userInfo.lastName
                                                        }}
                                                        validate={(values) => {
                                                            const errors = {}
                                                            if (!values.username) {
                                                                errors.username = "Please enter a username."
                                                            }
                                                            if (!values.password) {
                                                                errors.password = "Please enter your password to save changes."
                                                            }
                                                            if (!values.first_name) {
                                                                errors.first_name = "Please enter your first name."
                                                            }
                                                            if (!values.last_name) {
                                                                errors.last_name = "Please enter your last name."
                                                            }


                                                            return errors
                                                        }}
                                                        onSubmit={async (values, { setSubmitting, resetForm, setFieldError }) => {
                                                            setSubmitting(true)
                                                            try {

                                                                const res = await axios.put(`/api/users/${user.id}/update`, {
                                                                    username: values.username,
                                                                    password: values.password,
                                                                    first_name: values.first_name,
                                                                    last_name: values.last_name
                                                                })

                                                                if (res.status === 200) {
                                                                    user.username = values.username
                                                                    setSubmitting(false)
                                                                    resetForm()
                                                                }


                                                            } catch (error) {
                                                                if (error.response.status === 500 && error.response.data.message === "Invalid password.") {
                                                                    setFieldError("password", "Invalid password.")
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
                                                                    <Button type="submit">Confirm Changes</Button>
                                                                </GridItem>

                                                            </Grid>
                                                        </Form>
                                                    </Formik>
                                                </TabPane>
                                            </TabContent>
                                            <TabContent>
                                                <TabPane eventKey="change-password">
                                                    <Formik
                                                        initialValues={{
                                                            password: "",
                                                            new_password: "",
                                                            confirm_new_password: ""
                                                        }}
                                                        validate={(values) => {
                                                            const errors = {}
                                                            if (!values.password) {
                                                                errors.password = "Please enter your password to save changes."
                                                            }
                                                            if (!values.new_password) {
                                                                errors.new_password = "Please enter your new password."
                                                            }
                                                            if (!values.last_name) {
                                                                errors.confirm_new_password = "Please confirm your new password."
                                                            }




                                                            return errors
                                                        }}
                                                        onSubmit={async (values, { setSubmitting, resetForm, setFieldError }) => {
                                                            setSubmitting(true)
                                                            try {

                                                                const res = await axios.put(`/api/users/${user.id}/update`, {
                                                                    password: values.password,
                                                                    new_password: values.new_password,
                                                                    confirm_new_password: values.confirm_new_password
                                                                })

                                                                if (res.status === 200) {
                                                                    setSubmitting(false)
                                                                    resetForm()
                                                                }


                                                            } catch (error) {
                                                                if (error.response.status === 500 && error.response.data.message === "Your new password can't be the same as your old password.") {
                                                                    setFieldError("new_password", error.response.data.message)
                                                                }
                                                            }

                                                            setSubmitting(false)

                                                        }}
                                                    >
                                                        <Form>
                                                            <Grid templateRows="repeat(6, 1fr)" templateColumns="repeat(2, 1fr)" gap={5} width="80%" mx="auto">

                                                                <GridItem rowSpan={1} colSpan={2}>
                                                                    <FormLabel>Current Password</FormLabel>
                                                                    <Field name="password" type="password" as={Input} />
                                                                    <ErrorMessage name="password" />
                                                                </GridItem>
                                                                <GridItem rowSpan={1} colSpan={2}>
                                                                    <FormLabel>New Password</FormLabel>
                                                                    <Field name="new_password" type="password" as={Input} />
                                                                    <ErrorMessage name="new_password" />
                                                                </GridItem>
                                                                <GridItem rowSpan={1} colSpan={2}>
                                                                    <FormLabel>Confirm New Password</FormLabel>
                                                                    <Field name="confirm_new_password" type="password" as={Input} />
                                                                    <ErrorMessage name="confirm_new_password" />
                                                                </GridItem>
                                                                <GridItem rowSpan={1} colSpan={2}>
                                                                    <Button type="submit">Confirm Changes</Button>
                                                                </GridItem>

                                                            </Grid>
                                                        </Form>
                                                    </Formik>
                                                </TabPane>
                                            </TabContent>

                                        </Col>

                                    </Row>
                                    {/* <ListGroupItem action href="#general-info">
                                        User Information
                                    </ListGroupItem>
                                    <ListGroupItem action href="#change-password">
                                        Change Password
                                    </ListGroupItem> */}
                                </TabContainer>
                            ) : (
                                <Spinner />
                            )

                        }



                    </Container>

                    // <SettingsPane items={menu} index="/settings/info">
                    //     <SettingsContent>
                    //         <SettingsPage handler="/settings/info">
                    //             <Formik
                    //                 initialValues={{
                    //                     username: userInfo.id,
                    //                     first_name: userInfo.firstName,
                    //                     last_name: userInfo.lastName
                    //                 }}
                    //             >
                    //                 <Form>
                    //                     <FormLabel>Username</FormLabel>
                    //                     <Field name="username" as={Input}/>

                    //                     <FormLabel>First Name</FormLabel>
                    //                     <Field name="first_name" as={Input}/>

                    //                     <FormLabel>Last Name</FormLabel>
                    //                     <Field name="last_name" as={Input}/>

                    //                     <FormLabel>Password</FormLabel>
                    //                     <Field name="password" type="password" as={Input}/>

                    //                 </Form>
                    //             </Formik>
                    //         </SettingsPage>
                    //         <SettingsPage handler="/settings/change-password">

                    //         </SettingsPage>
                    //     </SettingsContent>
                    // </SettingsPane>
                ) : (
                    <Redirect to="/" />
                )
            }
        </div>
    )
}
