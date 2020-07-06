import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Flex, Box, Card, Heading, Text, Form, Field, Button, Loader } from 'rimble-ui';

import axios from 'axios';

import api from '../../service/api';
import UserData from '../../components/UserData';

const Client = () => {

    const history = useHistory();
    const [cookies, setCookie, removeCookie] = useCookies();

    const [approvedFiList, setApprovedFiList] = useState([]);
    const [fiId, setFiId] = useState('');
    const [newApprovedFi, setNewApprovedFi] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [clientData, setClientData] = useState([]);

    function handleChooseFi(e) {
        setFiId(e.target.value.toUpperCase());
    };

    useEffect(() => {
        try {
            axios.all([
                api.get('/client/getClientData', { withCredentials: true }),
                api.get('/client/getApprovedFis', { withCredentials: true })
            ])
                .then(axios.spread(
                    (clientData, approvedFis) => {
                        if (clientData.status === 200 && approvedFis.status === 200) {
                            clientData = clientData.data.clientData;
                            approvedFis = approvedFis.data.approvedFis;
                            setClientData([
                                { label: 'Name', value: clientData.name },
                                { label: 'Address', value: clientData.address },
                                { label: 'Date of Birth', value: clientData.dateOfBirth },
                                { label: 'Id Number', value: clientData.idNumber }
                            ]);
                            setApprovedFiList(approvedFis);
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

    // useEffect(() => {
    //     if (isLoading) {
    //         try {
    //             api
    //                 .post(`/client/approve`, { fiId })
    //                 .then(res => {
    //                     if (res.status === 200) {
    //                         console.log('approved');
    //                         setFiId('');
    //                         setNewApprovedFi(true);
    //                         setApprovedFiList((approvedFiList) => [...approvedFiList, fiId]);
    //                     } else {
    //                         console.log('Oopps... something wrong, status code ' + res.status);
    //                         return function cleanup() { }
    //                     }
    //                 })
    //                 .catch((err) => {
    //                     console.log('Oopps... something wrong');
    //                     console.log(err);
    //                     return function cleanup() { }
    //                 })
    //                 .finally(() => {
    //                     setIsLoading(false);
    //                 });
    //         } catch (error) {
    //             console.log('Oopps... something wrong');
    //             console.log(error);
    //             setIsLoading(false);
    //             return function cleanup() { }
    //         }
    //     }
    // }, [isLoading, fiId]);

    const handleSubmit = e => {
        e.preventDefault();
        setIsLoading(true);
    };

    function handleClickLogout() {
        removeCookie('userJWT');
        removeCookie('ledgerId');
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
                            {newApprovedFi &&
                                <Box px={3}>
                                    <Text>Approved!</Text>
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