import React from 'react';
import { Flex, Box, Heading, Text } from 'rimble-ui';

const UserData = ({ userData }) => {
    return (
        <Box bg={'#f1f1f1'} p={3} borderRadius={1}>
            {userData.map((item, key) => (
                <Flex my={1} key={key}>
                    <Box width={[1, 1 / 2, 1 / 3, 1 / 6]}>
                        <Heading as={'h4'} my={'auto'}>{item.label}</Heading>
                    </Box>
                    <Box width={1}>
                        <Text>{item.value}</Text>
                    </Box>
                </Flex>
            ))}
        </Box>
    );
}

export default UserData;