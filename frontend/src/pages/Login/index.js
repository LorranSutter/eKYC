import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Flex, Box, Card, Heading, Form, Field, Radio, Button, Loader, Image } from 'rimble-ui';

import qs from 'qs';

import logo from '../../assets/eKYC.svg';
import api from '../../service/api';

const Login = () => {

    const history = useHistory();
    const [cookies, setCookie, removeCookie] = useCookies();

    const [validated, setValidated] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("client");
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    function handleLogin(e) {
        setLogin(e.target.value);
    };

    function handlePassword(e) {
        setPassword(e.target.value);
    };

    function handleRadio(e) {
        setUserType(e.target.value);
    };

    const validateForm = useCallback(
        () => {
            if (
                login.length > 0 &&
                password.length > 5 &&
                userType.length > 0 &&
                !isLoading
            ) {
                setValidated(true);
                setSubmitDisabled(false);
            } else {
                setValidated(false);
                setSubmitDisabled(true);
            }
        },
        [login, password, userType, isLoading]
    );

    useEffect(() => {
        validateForm();
    }, [validateForm]);

    useEffect(() => {
        if (validated && isLoading) {
            try {
                api
                    .post(`/${userType}/login`, qs.stringify({ login, password, userType }))
                    .then(res => {
                        if (res.status === 200) {

                            removeCookie('userJWT');
                            removeCookie('ledgerId');
                            removeCookie('whoRegistered');
                            removeCookie('orgCredentials');

                            setCookie('userJWT', res.data.userJWT);
                            res.data.ledgerId && setCookie('ledgerId', res.data.ledgerId);
                            res.data.whoRegistered && setCookie('whoRegistered', res.data.whoRegistered);
                            res.data.orgCredentials && setCookie('orgCredentials', res.data.orgCredentials);
                            history.push(`/${userType}`);

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
    }, [login, password, userType, validated, isLoading, history, setCookie]);

    const handleSubmit = e => {
        e.preventDefault();
        setIsLoading(true);
    };

    return (
        <Flex height={'100vh'}>
            <Box mx={'auto'} my={'auto'} width={[1, 1 / 2, 1 / 3, 1 / 4]}>
                <Card>
                    <Image
                        alt="eKYC logo"
                        height="130"
                        width={1}
                        src={logo}
                    />
                    <Heading as={'h1'} mt={1} mb={3} textAlign={'center'} color={'primary'}>eKYC</Heading>
                    <Form onSubmit={handleSubmit}>
                        <Flex mx={-3} flexWrap={"wrap"}>
                            <Box width={1} px={3}>
                                <Field label="Login" width={1}>
                                    <Form.Input
                                        type="text"
                                        required
                                        onChange={handleLogin}
                                        value={login}
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
                                        value={password}
                                        width={1}
                                    />
                                </Field>
                            </Box>
                        </Flex>
                        <Flex mx={-3} flexWrap={"wrap"}>
                            <Box width={1} px={3}>
                                <Field label="Role" optional={false}>
                                    <Radio
                                        label="Client"
                                        my={2}
                                        value={"client"}
                                        checked={userType === "client"}
                                        onChange={handleRadio}
                                    />
                                    <Radio
                                        label="Financial Institution"
                                        my={2}
                                        value={"fi"}
                                        checked={userType === "fi"}
                                        onChange={handleRadio}
                                    />
                                </Field>
                            </Box>
                        </Flex>
                        <Button type="submit" disabled={submitDisabled} width={1}>
                            {isLoading ? <Loader color="white" /> : <p>Login</p>}
                        </Button>
                    </Form>
                </Card>
            </Box>
        </Flex>
    );
}

export default Login;