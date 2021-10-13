import { Box, Square, Heading, Image, Text } from '@chakra-ui/react'
import React from 'react'

export default function ListContainer({ img = null, name, description = "" }) {
    return (
        <Box border="1px" width="300px">
            {
                img ? (
                    <Image src={img} width="100%" />
                ) : (

                    <Square height="300px" bgColor="gray" />
                )
            }
            <Box margin="20px">
                <Box my={2}>
                    <Heading noOfLines={3} fontSize="1.5rem">
                        {name}
                    </Heading>
                </Box>
                <Box my={2} noOfLines={3}>
                    {description}
                </Box>
            </Box>
        </Box>
    )
}
