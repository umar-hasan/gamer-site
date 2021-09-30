import React, { useEffect, useState } from 'react'
import { Box, Container, HStack, Image, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import GameContainer from '../components/GameContainer'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import axios from 'axios'

export default function SearchResults({ query }) {

    const [games, setgames] = useState([])
    const [consoles, setconsoles] = useState([])

    const imgUrl = "https://images.igdb.com/igdb/image/upload/t_cover_med_2x/"
    const imgUrlLogo = "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/"


    const { search } = useLocation()
    const { q } = queryString.parse(search)

    useEffect(() => {

        try {
            
            const getResults = async () => {
    
                const res = await axios.get(`/api/igdb/search/${q}`)
    
                console.log(res.data.consoles)

                if (res.data.games) {

                    setgames([...res.data.games])
                }
                if (res.data.consoles) {

                    setconsoles([...res.data.consoles])
                    
                }
    
    
            }
    
            getResults()
        } catch (error) {
            setgames([])
            setconsoles([])
        }

        return () => {
            setgames([])
            setconsoles([])
        }
    }, [q])


    return (
        <div>
            <Tabs defaultIndex={0}>
                <TabList>
                    <Tab>Games</Tab>
                    <Tab>Consoles</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        {
                            games.length > 0 ? (
                                games.map(g => (
                                    <GameContainer id={g.id} 
                                                   box={false} 
                                                   image={"cover" in g ? `${imgUrl}${g.cover.image_id}.png`: null} 
                                                   title={g.name} 
                                                   info={{ release: g.first_release_date }} />
                                ))

                            ) : (
                                <p>No results found.</p>
                            )
                            
                        }
                    </TabPanel>

                    <TabPanel>
                        {
                            consoles.length > 0 ? (
                                
                                consoles.map(c => (
                                    <Box >
                                        <HStack>
                                        <Image src={`${imgUrlLogo}${c.versions[0].platform_logo.image_id}.png`} />
                                        <a href={`/consoles/${c.slug}`}>{c.name}</a>
                                        </HStack>
    
                                    </Box>
                                ))
                            ) : (
                                <p>No results found.</p>
                            )
                        }
                    </TabPanel>
                </TabPanels>

            </Tabs>
        </div>
    )
}
