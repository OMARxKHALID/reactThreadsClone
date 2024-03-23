import {
    Flex,
    Box,
    FormControl,
    Input,
    InputGroup,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    Divider,
} from '@chakra-ui/react'
import { useDispatch } from 'react-redux';
import { changeState, setUser } from '../redux/authSlice';
import useShowToast from '../hooks/useShowToast';
import { useState } from 'react';

export default function LoginCard() {
    const inputBgColor = useColorModeValue("gray.200", "gray.900");

    const dispatch = useDispatch();
    const showToast = useShowToast();

    const [isLoading, setIsLoading] = useState(false);
    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    });

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs),
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                setIsLoading(false);
                return;
            }
            dispatch(setUser(data));
            setIsLoading(false);
            showToast("Success", "Logged in successfully", "success");
        } catch (error) {
            showToast("Error", error, "error");
            setIsLoading(false);
        }
    }

    return (
        <>
            <Flex align={'center'} justify={'center'} mt={56}>
                <Stack mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'2xl'} textAlign={'center'}>
                            Login
                        </Heading>
                    </Stack>
                    <Box rounded={'lg'} p={8} w={
                        {
                            base: "full",
                            sm: "400px"
                        }
                    }>
                        <Stack spacing={4}>
                            <FormControl isRequired>
                                <Input
                                    placeholder='Username'
                                    type="text"
                                    onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                                    value={inputs.username}
                                    bg={inputBgColor}
                                    color={'gray.light'}
                                    borderRadius={'2xl'}
                                    height={'14'}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <InputGroup>
                                    <Input
                                        placeholder='Password'
                                        type="password"
                                        onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                                        value={inputs.password}
                                        bg={inputBgColor}
                                        color={'gray.light'}
                                        borderRadius={'2xl'}
                                        height={'14'}
                                    />
                                </InputGroup>
                            </FormControl>
                            <Stack spacing={10} pt={2}>
                                <Button
                                    isLoading={isLoading}
                                    borderRadius="2xl"
                                    height="14"
                                    size="lg"
                                    bg={'gray.dark'}
                                    color={'gray.light'}
                                    _hover={{
                                        bg: 'black',
                                    }}
                                    onClick={handleLogin}
                                >
                                    Log in
                                </Button>
                            </Stack>
                            <Flex alignItems="center" justifyContent="center" mt="4">
                                <Divider borderColor="gray.light" flex="1" />
                                <Text mx="2" color={"gray.light"}>Or</Text>
                                <Divider borderColor="gray.light" flex="1" />
                            </Flex>
                            <Stack pt={4}>
                                <Text align={'center'} color={"gray.light"}>
                                    Don't have an account? <Link onClick={() => dispatch(changeState("signup"))} color={'blue.400'}>Sign up</Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </>
    )
}
