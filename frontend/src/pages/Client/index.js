import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Flex, Box, Card, Heading, Text, Form, Field, Button, Loader } from 'rimble-ui';

import qs from 'qs';
import axios from 'axios';

import api from '../../service/api';
import UserData from '../../components/UserData';
import { setUserData } from '../../functions/setUserData';

const Client = () => {

    const history = useHistory();
    const [cookies, setCookie, removeCookie] = useCookies();

    const [clientData, setClientData] = useState([]);
    const [approvedFiList, setApprovedFiList] = useState([]);
    const [fiIdApprove, setFiIdApprove] = useState('');
    const [approvedMsg, setApprovedMsg] = useState('');
    const [isLoadingApprove, setIsLoadingApprove] = useState(false);
    const [fiIdRemove, setFiIdRemove] = useState('');
    const [removedMsg, setRemovedMsg] = useState('');
    const [isLoadingRemove, setIsLoadingRemove] = useState(false);

    function handleChooseFiApprove(e) {
        setFiIdApprove(e.target.value.toUpperCase());
    };

    function handleChooseFiRemove(e) {
        setFiIdRemove(e.target.value.toUpperCase());
    };

    useEffect(() => {
        try {
            axios.all([
                api.get('/client/getClientData'),
                api.get('/client/getApprovedFis')
            ])
                .then(axios.spread(
                    (clientData, approvedFis) => {
                        if (clientData.status === 200 && approvedFis.status === 200) {
                            clientData = clientData.data.clientData;
                            approvedFis = approvedFis.data.approvedFis;
                            setUserData(clientData, setClientData);
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

    useEffect(() => {
        if (isLoadingApprove) {
            try {
                api
                    .post('/client/approve', qs.stringify({ fiId: fiIdApprove }))
                    .then(res => {
                        if (res.status === 200) {
                            setApprovedMsg(res.data.message);
                            const timer = setTimeout(() => {
                                setApprovedMsg('');
                            }, 5000);
                            setApprovedFiList((approvedFiList) => Array.from(new Set([...approvedFiList, fiIdApprove])));
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
                        setIsLoadingApprove(false);
                        setFiIdApprove('');
                    });
            } catch (error) {
                console.log('Oopps... something wrong2');
                console.log(error);
                setIsLoadingApprove(false);
                return function cleanup() { }
            }
        }
    }, [isLoadingApprove, fiIdRemove]);

    useEffect(() => {
        if (isLoadingRemove) {
            try {
                api
                    .post('/client/remove', qs.stringify({ fiId: fiIdRemove }))
                    .then(res => {
                        if (res.status === 200) {
                            setRemovedMsg(res.data.message);
                            const timer = setTimeout(() => {
                                setRemovedMsg('');
                            }, 5000);
                            setApprovedFiList((approvedFiList) => approvedFiList.filter(item => item !== fiIdRemove));
                            return () => clearTimeout(timer);
                        } else if (res.status === 202) {
                            setRemovedMsg(res.data.message);
                            const timer = setTimeout(() => {
                                setRemovedMsg('');
                            }, 5000);
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
                        setIsLoadingRemove(false);
                        setFiIdRemove('');
                    });
            } catch (error) {
                console.log('Oopps... something wrong2');
                console.log(error);
                setIsLoadingRemove(false);
                return function cleanup() { }
            }
        }
    }, [isLoadingRemove, fiIdRemove]);

    const handleSubmitApprove = e => {
        e.preventDefault();

        if (approvedFiList.includes(fiIdApprove)) {
            setApprovedMsg(`${fiIdApprove} already approved`);
            setTimeout(() => {
                setApprovedMsg('');
            }, 5000);
            setFiIdApprove('');
        } else {
            setIsLoadingApprove(true);
            setApprovedMsg('');
        }
    };

    const handleSubmitRemove = e => {
        e.preventDefault();

        if (!approvedFiList.includes(fiIdRemove)) {
            setRemovedMsg(`${fiIdRemove} is not approved`);
            setTimeout(() => {
                setRemovedMsg('');
            }, 5000);
            setFiIdRemove('');
        } else {
            setIsLoadingRemove(true);
            setRemovedMsg('');
        }
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
            <Box mx={'auto'} width={[1, 10 / 12]}>
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
                    <Form onSubmit={handleSubmitApprove}>
                        <Flex mx={-3}>
                            <Box width={1} px={3}>
                                <Field label="Financial institution ID" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={handleChooseFiApprove}
                                        value={fiIdApprove}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                        </Flex>
                        <Flex mx={-3} alignItems={'center'}>
                            <Box px={3}>
                                <Button type="submit" disabled={isLoadingApprove}>
                                    {isLoadingApprove ? <Loader color="white" /> : <p>Approve</p>}
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
                <Card mt={20}>
                    <Heading as={'h2'}>Remove financial institution approval</Heading>
                    <Form onSubmit={handleSubmitRemove}>
                        <Flex mx={-3}>
                            <Box width={1} px={3}>
                                <Field label="Financial institution ID" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={handleChooseFiRemove}
                                        value={fiIdRemove}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                        </Flex>
                        <Flex mx={-3} alignItems={'center'}>
                            <Box px={3}>
                                <Button type="submit" disabled={isLoadingRemove}>
                                    {isLoadingRemove ? <Loader color="white" /> : <p>Remove</p>}
                                </Button>
                            </Box>
                            {removedMsg &&
                                <Box px={3}>
                                    <Text>{removedMsg}</Text>
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