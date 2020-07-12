import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Box, Card, Heading, Text, Form, Field, Button, Loader } from 'rimble-ui';

import qs from 'qs';

import api from '../../service/api';

const Login = () => {

    const history = useHistory();

    const [validated, setValidated] = useState(false);
    const [clientData, setClientData] = useState({});
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [newClientMsg, setNewClientMsg] = useState('');

    function handleName(e) {
        setClientData({ ...clientData, name: e.target.value });
    };

    function handleAddress(e) {
        setClientData({ ...clientData, address: e.target.value });
    };

    function handleDateOfBirth(e) {
        setClientData({ ...clientData, dateOfBirth: e.target.value });
    };

    function handleIdNumber(e) {
        setClientData({ ...clientData, idNumber: e.target.value });
    };

    function handleLogin(e) {
        setClientData({ ...clientData, login: e.target.value });
    };

    function handlePassword(e) {
        setClientData({ ...clientData, password: e.target.value });
    };

    function handleConfirmPassword(e) {
        setConfirmPassword(e.target.value);
    };

    const validateForm = useCallback(
        () => {
            if (
                clientData.name && clientData.name.length > 0 &&
                clientData.address && clientData.address.length > 0 &&
                clientData.dateOfBirth && clientData.dateOfBirth.length > 0 &&
                clientData.idNumber && clientData.idNumber.length > 0 &&
                clientData.login && clientData.login.length > 0 &&
                clientData.password && clientData.password.length > 5 &&
                clientData.password === confirmPassword &&
                !isLoading
            ) {
                setValidated(true);
                setSubmitDisabled(false);
            } else {
                setValidated(false);
                setSubmitDisabled(true);
            }
        },
        [clientData, confirmPassword, isLoading]
    );

    useEffect(() => {
        validateForm();
    }, [validateForm]);

    useEffect(() => {
        if (validated && isLoading) {
            try {
                api
                    .post('/fi/createClient', qs.stringify(clientData))
                    .then(res => {
                        console.log(res);
                        if (res.status === 200) {
                            setNewClientMsg(res.data.message);
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
                    });
            } catch (error) {
                console.log('Oopps... something wrong');
                console.log(error);
                setIsLoading(false);
                return function cleanup() { }
            }
        }
    }, [clientData, validated, isLoading, history]);

    const handleSubmit = e => {
        e.preventDefault();
        setIsLoading(true);
        setNewClientMsg('');
    };

    const handleClickOnBack = e => {
        e.preventDefault();
        history.push('/fi');
    }

    return (
        <Flex height={'100vh'}>
            <Box mx={'auto'} my={'auto'} width={[1, 9 / 12, 7 / 12]}>
                <Flex px={2} mx={'auto'} justifyContent='space-between'>
                    <Box my={'auto'}>
                        <Heading as={'h2'} color={'primary'}>New Client</Heading>
                    </Box>
                    <Box my={'auto'}>
                        <Button onClick={handleClickOnBack}>Back</Button>
                    </Box>
                </Flex>
                <Form onSubmit={handleSubmit}>
                    <Card mb={20}>
                        <Flex mx={-3} flexWrap={"wrap"}>
                            <Box width={1} px={3}>
                                <Field label="Name" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={handleName}
                                        value={clientData.name}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                            <Box width={1} px={3}>
                                <Field label="Address" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={handleAddress}
                                        value={clientData.address}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                            <Box width={1} px={3}>
                                <Field label="Date of Birth" width={1}>
                                    <Form.Input
                                        type="date"
                                        required
                                        onChange={handleDateOfBirth}
                                        value={clientData.dateOfBirth}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                            <Box width={1} px={3}>
                                <Field label="ID Number" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={handleIdNumber}
                                        value={clientData.idNumber}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                        </Flex>
                    </Card>
                    <Card>
                        <Flex mx={-3} flexWrap={"wrap"}>
                            <Box width={1} px={3}>
                                <Field label="Login" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={handleLogin}
                                        value={clientData.login}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                            <Box width={1} px={3}>
                                <Field label="Password" width={1}>
                                    <Form.Input
                                        type="password"
                                        required
                                        onChange={handlePassword}
                                        value={clientData.password}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                            <Box width={1} px={3}>
                                <Field label="Confirm password" width={1}>
                                    <Form.Input
                                        type="password"
                                        required
                                        onChange={handleConfirmPassword}
                                        value={confirmPassword}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                        </Flex>
                        <Flex mx={-3} alignItems={'center'}>
                            <Box px={3}>
                                <Button type="submit" mt={2} disabled={submitDisabled}>
                                    {isLoading ? <Loader color="white" /> : <p>Register new client</p>}
                                </Button>
                            </Box>
                            {newClientMsg &&
                                <Box px={3}>
                                    <Text>{newClientMsg}</Text>
                                </Box>
                            }
                        </Flex>
                    </Card>
                </Form>
            </Box>
        </Flex>
    );
}

export default Login;