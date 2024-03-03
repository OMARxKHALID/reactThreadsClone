import { Avatar, Box, Flex, Link, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { useToast } from '@chakra-ui/react';

const UserHeader = () => {
    const toast = useToast()
    const copyUrl = () => {
        const currentUrl = window.location.href;
        window.navigator.clipboard.writeText(currentUrl);
        toast({
            title: 'Profile link is Copied',
            status: 'success',
            duration: '1500',
            isClosable: true,
        })
    }
    return (
        <VStack gap={2} alignItems="start">
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize="2xl" fontWeight={"bold"}>omar.</Text>
                    <Flex gap={2} alignItems="center">
                        <Text fontSize="md">omarxoxo</Text>
                        <Text fontSize="xm" bg="gray.dark" color="gray.500" p={1} borderRadius="md">threads.net</Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar name="Omar Khalid" src="/profile-logo.jpg" size={{
                        base: "lg",
                        md: "xl",
                    }} />
                </Box>
            </Flex>
            <Text>just surviving on caffeine and a cold heart🖤.</Text>
            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.Light"}>2.3k followers</Text>
                    <Box w='2' h='2' bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"}>instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className='icon-container'>
                        <BsInstagram size={24} cursor={"pointer"} />
                    </Box>
                    <Box className='icon-container'>
                        <CgMoreO size={24} cursor={"pointer"} onClick={copyUrl} />
                    </Box>
                </Flex>
            </Flex>
            <Flex w={"full"} mt={1}>
                <Flex flex={1} borderBottom={"1.5px solid white"} pb='3' justifyContent={"center"} cursor={"pointer"}>
                    <Text fontWeight={"bold"}>Threads</Text>
                </Flex>
                <Flex flex={1} borderBottom={"1.5px solid white"} pb='3' justifyContent={"center"} color={"gray.light"} cursor={"pointer"}>
                    <Text fontWeight={"bold"}>Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    );
};

export default UserHeader;
