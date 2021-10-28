import { Box, Spinner, Image, CircularProgress, CircularProgressLabel, Center, HStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'

export default function GameContainer({ id, image, title, info, className = "", box = true }) {

    let thing

    useEffect(() => {

    }, [])

    if (info.hasOwnProperty("release")) {
        let date = new Date((info.release + 86400) * 1000)
        date = (date.toLocaleString("en-US")).replace(/, .*/, "")

        thing = date
    }
    else if (info.hasOwnProperty("score")) {
        thing = (<CircularProgress value={Math.floor(info.score)} color="green.400" thickness="15px" size="50px">
            <CircularProgressLabel>{Math.floor(info.score)}%</CircularProgressLabel>
        </CircularProgress>)
    }

    if (!image && title && (info.hasOwnProperty("release") || info.hasOwnProperty("score"))) {
        return (
            <div className="game-container">
                {
                    box ? (
                        <Box key={id} className="game-box">
                            <Box height="128px" width="128px" bgColor="gray" >
                                <Center color="white" py="25%" px="10px" textAlign="center">
                                    No Image Available
                                </Center>
                            </Box>
                            <Box>

                                <a href={`/games/${id}`}>
                                    {title}
                                </a>
                                <p>
                                    {thing}
                                </p>
                            </Box>
                        </Box>
                    ) : (
                        <Box key={id} className="game-row">
                            <HStack>

                                <Box height="128px" width="128px" bgColor="gray" >
                                    <Center color="white" py="25%" px="10px" textAlign="center">
                                        No Image Available
                                    </Center>
                                </Box>
                                <Box>

                                    <a href={`/games/${id}`}>
                                        {title}
                                    </a>
                                    <p>
                                        {thing}
                                    </p>
                                </Box>
                            </HStack>
                        </Box>
                    )
                }






            </div>
        )
    }

    if (image && title && (info.hasOwnProperty("release") || info.hasOwnProperty("score"))) {

        return (
            <div className="game-container">
                {
                    box ?
                        (
                            <Box key={id} width="100%" className="game-box">
                                <Image className={className} src={image} alt="" />
                                <a href={`/games/${id}`}>
                                    {title}
                                </a>
                                <p>
                                    {thing}
                                </p>
                            </Box>
                        ) : (
                            <Box key={id} width="100%" className="game-row">
                                <HStack>

                                    <Image className={className} src={image} alt="" />
                                    <Box>

                                        <a href={`/games/${id}`}>
                                            {title}
                                        </a>
                                        <p>
                                            {thing}
                                        </p>
                                    </Box>
                                </HStack>
                            </Box>
                        )
                }



            </div>
        )
    }

    return (
        <div>
            <Spinner />
        </div>
    )
}
