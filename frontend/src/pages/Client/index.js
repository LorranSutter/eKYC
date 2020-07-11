import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Flex, Box, Card, Heading, Text, Form, Field, Button, Loader } from 'rimble-ui';

import qs from 'qs';
import axios from 'axios';

import apiWithCredentials from '../../service/apiWithCredentials';
import UserData from '../../components/UserData';
import { setUserData } from '../../functions/setUserData';

const Client = () => {

    const history = useHistory();
    const [cookies, setCookie, removeCookie] = useCookies();

    const [approvedFiList, setApprovedFiList] = useState([]);
    const [fiId, setFiId] = useState('');
    const [approvedMsg, setApprovedMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [clientData, setClientData] = useState([]);

    function handleChooseFi(e) {
        setFiId(e.target.value.toUpperCase());
    };

    useEffect(() => {
        try {
            axios.all([
                apiWithCredentials.get('/client/getClientData'),
                apiWithCredentials.get('/client/getApprovedFis')
            ])
                .then(axios.spread(
                    (clientData, approvedFis) => {
                        if (clientData.status === 200 && approvedFis.status === 200) {
                            clientData = clientData.data.clientData;
                            approvedFis = approvedFis.data.approvedFis;
                            setApprovedFiList(approvedFis);
                            setUserData(clientData, setClientData);
                        } else {
                            console.log('Oopps... something wrong, status code ' + clientData.status);
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
                apiWithCredentials
                    .post('/client/approve', qs.stringify({ fiId }))
                    .then(res => {
                        if (res.status === 200) {
                            setApprovedMsg(res.data.message);
                            const timer = setTimeout(() => {
                                setApprovedMsg('');
                            }, 3000);
                            setApprovedFiList((approvedFiList) => Array.from(new Set([...approvedFiList, fiId])));
                            return () => clearTimeout(timer);
                        } else {
                            console.log('Oopps... something wrong, status code ' + res.status);
                            return function cleanup() { }
                        }
                    })
                    .catch((err) => {
                        console.log('Oopps... something wrong1');
                        console.log(err);
                        return function cleanup() { }
                    })
                    .finally(() => {
                        setIsLoading(false);
                        setFiId('');
                    });
            } catch (error) {
                console.log('Oopps... something wrong2');
                console.log(error);
                setIsLoading(false);
                return function cleanup() { }
            }
        }
    }, [isLoading, fiId]);

    const handleSubmit = e => {
        e.preventDefault();
        setIsLoading(true);
        setApprovedMsg('');
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
            <Box mx={'auto'} width={10 / 12}>
                <Flex px={2} mx={'auto'} justifyContent='space-between'>
                    <Box my={'auto'}>
                        <Heading as={'h1'} color='primary'>eKYC</Heading>
                    </Box>
                    <Box my={'auto'}>
                        <Button onClick={handleClickLogout}>Logout</Button>
                    </Box>
                </Flex>
                <Card>
                    <Heading as={'h2'}>Client data</Heading>
                    <UserData userData={clientData} />
                </Card>
                <Card mt={20}>
                    <Flex my={1}>
                        <Box ml={10} my={1}>
                            {approvedFiList.length > 0 ?
                                <Heading as={'h3'} my={'auto'}>Your approved financial institutions:</Heading>
                                :
                                <Heading as={'h3'} my={'auto'}>You have no approved financial institutions</Heading>
                            }
                        </Box>
                        <Box ml={10} my={1}>
                            {approvedFiList.join(', ')}
                        </Box>
                    </Flex>
                </Card>
                <Card mt={20}>
                    <Heading as={'h2'}>Approve financial institution</Heading>
                    <Form onSubmit={handleSubmit}>
                        <Flex mx={-3}>
                            <Box width={1} px={3}>
                                <Field label="Financial institution ID" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={handleChooseFi}
                                        value={fiId}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                        </Flex>
                        <Flex mx={-3} alignItems={'center'}>
                            <Box px={3}>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <Loader color="white" /> : <p>Approve</p>}
                                </Button>
                            </Box>
                            {approvedMsg &&
                                <Box px={3}>
                                    <Text>{approvedMsg}</Text>
                                </Box>
                            }
                        </Flex>
                    </Form>
                </Card>
            </Box>
        </Flex>
    );
}

export default Client;