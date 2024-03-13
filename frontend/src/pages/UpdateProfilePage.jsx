import { useRef } from 'react'
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    IconButton,
    Center,
    AvatarBadge,
} from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import { useDispatch, useSelector } from 'react-redux';
import useShowToast from '../hooks/useShowToast';
import { useState } from 'react';
import usePreviewImg from '../hooks/usePreviewImg';
import { setUser } from '../redux/authSLice';
import { useNavigate } from 'react-router-dom';

export default function UpdateProfilePage() {
    const inputBgColor = useColorModeValue("gray.200", "gray.900");

    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const showToast = useShowToast();
    const { imgUrl, setImgUrl, handleImageChange } = usePreviewImg();

    const imgRef = useRef(false);
    const [isLoading, setIsLoading] = useState(false); 
    const [inputs, setInputs] = useState({
        username: user.username,
        name: user.name,
        email: user.email,
        password: "",
        bio: user.bio,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`/api/users/update/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                setIsLoading(false);
                return;
            }
            dispatch(setUser(data));
            setIsLoading(false);
            showToast("Success", "Profile updated successfully", "success");
        } catch (error) {
            showToast("Error", error, "error");
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Flex
                align={'center'}
                justify={'center'}
            >
                <Stack
                    spacing={4}
                    w={'full'}
                    maxW={'lg'}
                    p={6}
                    my={8}>
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        User Profile Edit
                    </Heading>
                    <FormControl id="userName">
                        <FormLabel>Profile Pic</FormLabel>
                        <Stack direction={['column', 'row']} spacing={6}>
                            <Center>
                                <Avatar size="xl" bg={"gray.300"} boxShadow={"md"} src={imgUrl || user.profilePic}>
                                    <AvatarBadge
                                        as={IconButton}
                                        size="sm"
                                        rounded="full"
                                        top="-10px"
                                        colorScheme="red"
                                        icon={<SmallCloseIcon onClick={() => setImgUrl(null)} />}
                                    />
                                </Avatar>
                            </Center>
                            <Center w="full">
                                <Button w="250px" bg={'gray.dark'}
                                    color={'gray.light'}
                                    borderRadius={'2xl'}
                                    height="12"
                                    _hover={{
                                        bg: 'black',
                                    }}
                                    onClick={() => {
                                        imgRef.current.click();
                                    }}
                                >
                                    Change Pic
                                </Button>
                                <input type='file' ref={imgRef} onChange={handleImageChange} hidden />
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                            placeholder="Full Name"
                            type="text"
                            value={inputs.name}
                            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                            bg={inputBgColor}
                            color={'gray.light'}
                            borderRadius={'2xl'}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input
                            placeholder="Username"
                            type="text"
                            value={inputs.username}
                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                            bg={inputBgColor}
                            color={'gray.light'}
                            borderRadius={'2xl'}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Bio</FormLabel>
                        <Input
                            placeholder="Bio"
                            type="text"
                            value={inputs.bio}
                            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                            bg={inputBgColor}
                            color={'gray.light'}
                            borderRadius={'2xl'}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            placeholder="your-email@example.com"
                            type="email"
                            value={inputs.email}
                            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                            bg={inputBgColor}
                            color={'gray.light'}
                            borderRadius={'2xl'}
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder="password"
                            type="password"
                            value={inputs.password}
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                            bg={inputBgColor}
                            color={'gray.light'}
                            borderRadius={'2xl'}
                        />
                    </FormControl>
                    <Stack spacing={6} mt={2} direction={['column', 'row']}>
                        <Button
                            w="full"
                            borderRadius="2xl"
                            height="14"
                            bg={'gray.dark'}
                            color={'gray.light'}
                            _hover={{
                                bg: 'black',
                            }}
                            onClick={() =>
                                navigate(`/${user?.username}`)
                            }
                            >
                            Cancel
                        </Button>
                        <Button
                            isLoading={isLoading} 
                            type="submit"
                            borderRadius="2xl"
                            height="14"
                            w="full"
                            bg={'gray.dark'}
                            color={'gray.light'}
                            _hover={{
                                bg: 'black',
                            }}>
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    )
}
