import React, { useEffect, useState } from 'react'
import { Divider, IconButton, Input } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { Link, Redirect, useHistory } from 'react-router-dom'
import axios from 'axios'
import { useUserContext } from '../hooks/UserContext'
import { Field, Form, Formik } from 'formik'

export default function Navbar(props) {

    const history = useHistory()

    const [game_menu, setGame] = useState(false)
    const [console_menu, setConsole] = useState(false)
    const [publisher_menu, setPublisher] = useState(false)
    const { loggedIn, setloggedIn, user, setuser } = useUserContext()
    const [login, setlogin] = useState(!loggedIn)

    useEffect(() => {
        if (loggedIn) setlogin(false)
        else setlogin(true)

    }, [loggedIn, user])

    const toggleGame = () => {
        setGame(!game_menu)
    }

    const toggleConsole = () => {
        setConsole(!console_menu)
    }

    const togglePublisher = () => {
        setPublisher(!publisher_menu)
    }



    return (
        <div id="navbar-wrapper">
            <nav id="navbar">
                <div id="search-bar">
                    <Formik
                        initialValues={{
                            query: ''
                        }}
                        onSubmit={(values) => {
                            history.push(`/search?q=${values.query}`)
                        }}>

                        <Form>

                            <Field name="query" placeholder="Search..." as={Input} />
                            <IconButton type="submit" icon={<SearchIcon color="black" />} />
                        </Form>
                    </Formik>

                </div>

                <div id="nav-links">

                    <li className="nav-item">
                        <div>
                            <Link to="/games">
                                Games
                            </Link>
                        </div>
                        <div id="games-link" className="dropdown-link">
                            <ul>
                                <li>
                                    <Link to="/top-rated">
                                        Top Rated
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/new-releases">
                                        Newest Releases
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/upcoming">
                                        Coming Soon
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="nav-item">
                        <div>
                            <Link>
                                Consoles
                            </Link>
                        </div>
                        <div id="consoles-link" className="dropdown-link">
                            <ul>
                                <li>
                                    <Link to="/consoles/pc">
                                        PC
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/consoles/switch">
                                        Nintendo Switch
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/consoles/ps5">
                                        PS5
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/consoles/ps4">
                                        PS4
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/consoles/xbox-series-x">
                                        Xbox Series X
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/consoles/xbox-one">
                                        Xbox One
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li>

                    {/* <li className="nav-item">
                        <div>
                            <Link to="/publishers">
                                Publishers
                            </Link>
                        </div>
                        <div id="publishers-link" className="dropdown-link">
                            <ul>
                                <li>
                                    <Link to="/publishers/sony">
                                        Sony
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/publishers/nintendo">
                                        Nintendo
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/publishers/microsoft">
                                        Microsoft
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/publishers/sega">
                                        Sega
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/publishers/baandai-namco">
                                        Bandai Namco
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li> */}

                    <Divider orientation="vertical" scale={1} />

                    {/* <li className="nav-item">
                        <div>
                            <Link to="/about">
                                About

                            </Link>
                        </div>
                    </li> */}
                    <li className="nav-item">
                        {
                            login && !user ? (
                                <div>
                                    <Link to="/login">
                                        Login
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        {
                                            user ? (

                                                <Link>
                                                    {user.username}
                                                </Link>
                                            ) : (
                                                <Link>
                                                    User
                                                </Link>
                                            )
                                        }

                                    </div>
                                    {
                                        user ? (

                                            <div id="profile-link" className="dropdown-link">
                                                <ul>

                                                    <li>
                                                        <Link to="/settings">Settings</Link>
                                                    </li>
                                                    <li>
                                                        <Link to={`/users/${user.id}/lists`}>Game Lists</Link>
                                                    </li>
                                                    <li>
                                                        <Link onClick={async () => {
                                                            const res = await axios.post("/api/users/logout")
                                                            if (res.status === 200) {
                                                                setloggedIn(false)
                                                                setlogin(true)
                                                                return (
                                                                    <Redirect to="/" />
                                                                )
                                                            }
                                                        }}>
                                                            Logout
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        ) : (
                                            <></>
                                        )
                                    }
                                </>
                            )
                        }
                    </li>

                </div>
            </nav>
        </div>
    )
}
