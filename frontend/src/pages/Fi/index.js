import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Flex, Box, Card, Heading, Form, Text, Button, Loader } from 'rimble-ui';

import axios from 'axios';

import api from '../../service/api';
import UserData from '../../components/UserData';
import { setUserData } from '../../functions/setUserData';

const Fi = () => {

    const history = useHistory();
    const [cookies, setCookie, removeCookie] = useCookies();

    const [approvedClientList, setApprovedClientList] = useState([]);
    const [clientId, setClientId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [clientFields, setClientFields] = useState(new Set());
    const [acquiredClientData, setAcquiredClientData] = useState({});
    const [fiData, setFiData] = useState([]);

    function handleChooseClient(e) {
        setClientId(e.target.value.toUpperCase());
    };

    const handleClientFields = useCallback((e) => {
        const field = e.target.value;
        if (e.target.checked) {
            setClientFields((clientFields) => clientFields.add(field));
        } else {
            setClientFields((clientFields) => new Set([...clientFields].filter(item => item !== field)));
        }
    }, []);

    useEffect(() => {
        try {
            axios.all([
                api.get('/fi/getFiData'),
                api.get('/fi/getApprovedClients')
            ])
                .then(axios.spread(
                    (fiData, approvedClients) => {
                        if (fiData.status === 200 && approvedClients.status === 200) {
                            fiData = fiData.data.fiData;
                            approvedClients = approvedClients.data.approvedClients
                            setFiData([
                                { label: 'Name', value: fiData.name },
                                { label: 'Id Number', value: fiData.idNumber }
                            ]);
                            setApprovedClientList(approvedClients);
                        } else {
                            console.log('Oopps... something wrong, status code ' + fiData.status);
                            return function cleanup() { }
                        }
                    }))
                .catch((err) => {
                    console.log('Oopps... something wrong');
                    console.log(err);
                    return function cleanup() { }
                });
        } catch (error) {
            console.log('Oopps... something wrong');
            console.log(error);
            return function cleanup() { }
        }
    }, []);

    useEffect(() => {
        if (isLoading) {
            try {
                api
                    .get('/fi/getClientData', {
                        params: {
                            clientId: clientId,
                            fields: [...clientFields]
                        }
                    })
                    .then(res => {
                        if (res.status === 200) {
                            setUserData(res.data.clientData, setAcquiredClientData);
                        } else {
                            console.log('Oopps... something wrong, status code ' + res.status);
                            return function cleanup() { }
                        }
                    })
                    .catch((err) => {
                        console.log('Oopps... something wrong');
                        console.log(err);
                        return function cleanup() { }
                    })
                    .finally(() => {
                        setIsLoading(false);
                        setClientId('');
                    });
            } catch (error) {
                console.log('Oopps... something wrong');
                console.log(error);
                setIsLoading(false);
                return function cleanup() { }
            }
        }
    }, [isLoading, clientFields, clientId]);

    const handleSubmit = e => {
        e.preventDefault();
        setIsLoading(true);
    };

    const handleClickNewClient = e => {
        e.preventDefault();
        setIsLoading(true);
        history.push('/fi/newClient');
    };

    function handleClickLogout() {
        removeCookie('userJWT');
        removeCookie('ledgerId');
        removeCookie('whoRegistered');
        removeCookie('orgCredentials');
        history.push('/login');
    }

    return (
        <Flex minWidth={380}>
            <Box mx={'auto'} width={[1, 11 / 12, 10 / 12]}>
                <Flex px={2} mx={'auto'} justifyContent='space-between'>
                    <Box my={'auto'}>
                        <Heading as={'h1'} color='primary'>eKYC</Heading>
                    </Box>
                    <Box my={'auto'}>
                        <Button mr={2} onClick={handleClickNewClient}>New Client</Button>
                        <Button onClick={handleClickLogout}>Logout</Button>
                    </Box>
                </Flex>
                <Card>
                    <Heading as={'h2'}>Financial institution data</Heading>
                    <UserData userData={fiData} />
                </Card>
                <Card mt={20}>
                    <Flex my={1}>
                        <Box ml={10} my={1}>
                            {approvedClientList.length > 0 ?
                                <Heading as={'h3'} my={'auto'}>Your approved clients:</Heading>
                                :
                                <Heading as={'h3'} my={'auto'}>You have no approved clients</Heading>
                            }
                        </Box>
                        <Box ml={10} my={1}>
                            {approvedClientList.join(', ')}
                        </Box>
                    </Flex>
                </Card>
                <Card mt={20}>
                    <Heading as={'h2'}>Get client data</Heading>
                    <Form onSubmit={handleSubmit}>
                        <Flex mx={-3}>
                            <Box width={1} px={3}>
                                <Form.Field label="Client ID" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={handleChooseClient}
                                        value={clientId}
                                    />
                                </Form.Field>
                                <Box mb={2}>
                                    <Text mb={2} fontWeight={600} fontSize={'14px'}>What data do you want?</Text>
                                    <Form.Check label="Name" value="name" onChange={handleClientFields} />
                                    <Form.Check label="Address" value="address" onChange={handleClientFields} />
                                    <Form.Check label="Date of Birth" value="dateOfBirth" onChange={handleClientFields} />
                                    <Form.Check label="Id Number" value="idNumber" onChange={handleClientFields} />
                                </Box>
                            </Box>
                        </Flex>
                        <Flex mx={-3}>
                            <Box px={3}>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <Loader color="white" /> : <p>Submit</p>}
                                </Button>
                            </Box>
                        </Flex>
                    </Form>
                </Card>
                {acquiredClientData.length > 0 &&
                    <Box mx={'auto'} mt={20}>
                        <Card>
                            <Heading as={'h2'}>Acquired client data</Heading>
                            <UserData userData={acquiredClientData} />
                        </Card>
                    </Box>
                }
            </Box>
        </Flex>
    );
}

export default Fi;


