import { Avatar, Box, Divider, Flex, Image, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Actions from './Actions';

const UserPost = () => {
    const [liked, setLiked] = useState(false);
    return (
        <Link to={"/omar/post/1"}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size={"md"} src='/profile-logo.jpg' />
                    <Box w='1px' h={"full"} bg="gray.light" my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        <Avatar src='/profile-logo.jpg' size='xs' name='Omar' position={"absolute"} left={"50%"} transform={"translate(-50%, -50%)"} padding={"2px"} top={'18px'} />
                        <Avatar size='xs' src='/profile-logo.jpg' name='Omar' position={"absolute"} right={"-3px"} padding={"2px"} top={'50%'} transform={"translateY(-50%)"} />
                        <Avatar size='xs' src='/profile-logo.jpg' name='Omar' position={"absolute"} left={"-3px"} padding={"2px"} top={'50%'} transform={"translateY(-50%)"} />
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontWeight={"bold"} fontSize={"md"}>omarxoxo</Text>
                            <Image src='/verified.png' w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"}>this is my first post.</Text>
                    <Box borderRadius={5} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                        <Image src='/post1.jpg' w={"full"} h={"full"} />
                    </Box>
                    <Flex>
                        <Actions liked={liked} setLiked={setLiked} />
                    </Flex>
                    <Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize={"sm"}>123 replies</Text>
                        <Box w={0.5} h={0.5} bg={"gray.light"} borderRadius={"full"}></Box>
                        <Text color={"gray.light"} fontSize={"sm"}>456 likes</Text>
                    </Flex>
                </Flex>
            </Flex>
            <Divider borderColor={"gray.light"} mt={6}/>
        </Link>
    );
};

export default UserPost;
