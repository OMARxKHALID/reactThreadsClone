import React, { useState } from 'react';
import { Avatar, Box, Flex, Link, Text, VStack } from '@chakra-ui/react';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { FiSettings } from "react-icons/fi";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { Link as RouterLink } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { followUser, unfollowUser } from '../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const UserHeader = ({ user }) => {
    const showToast = useShowToast();
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const isFollowing = user && user.followers.includes(authUser._id);

    const handleFollowAndUnfollow = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
            } else {
                dispatch(isFollowing ? unfollowUser({ userId: user._id, authUserId: authUser._id }) : followUser({ userId: user._id, authUserId: authUser._id }));
                showToast("Success", data.message, "success");
            }
        } catch (error) {
            showToast("Error", error, "error");
        } finally {
            setLoading(false);
        }
    };

    const copyUrl = () => {
        const currentUrl = window.location.href;
        window.navigator.clipboard.writeText(currentUrl);
        showToast("Success", "Link copied to clipboard", "success");
    }

    return (
        <VStack gap={2} alignItems="start">
            <Flex justifyContent="space-between" w="full">
                <Box>
                    <Text fontSize="2xl" fontWeight="bold">{user?.name}</Text>
                    <Flex gap={2} alignItems="center">
                        <Text fontSize="md">{user?.username}</Text>
                        <Text fontSize="sm" bg="gray.700" color="gray.200" p={1} borderRadius="md">threads.net</Text>
                    </Flex>
                </Box>
                <Avatar src={user?.profilePic || "https://via.placeholder.com/150"} size={{ base: "lg", md: "xl" }} />
            </Flex>
            <Text>{user?.bio}</Text>
            <Flex w="full" justifyContent="space-between">
                <Flex gap={2} alignItems="center">
                    <Text color="gray.500">{user?.followers.length} followers</Text>
                    <Box w='1' h='1' bg="gray.500" borderRadius="full"></Box>
                    <Text color="gray.500">{user?.following.length} following</Text>
                </Flex>
                <Flex alignItems="center">
                    {authUser?._id === user?._id && (
                        <Link as={RouterLink} to="/update">
                            <Box className='icon-container'>
                                <FiSettings cursor="pointer" size={24} />
                            </Box>
                        </Link>
                    )}
                    {authUser?._id !== user?._id && (
                        <Box className='icon-container' onClick={handleFollowAndUnfollow}>
                            {isFollowing ? <SlUserUnfollow cursor="pointer" size={24} /> : <SlUserFollow cursor="pointer" size={24} />}
                        </Box>
                    )}
                    <Box className='icon-container'>
                        <BsInstagram size={24} cursor="pointer" />
                    </Box>
                    <Box className='icon-container'>
                        <CgMoreO size={24} cursor="pointer" onClick={copyUrl} />
                    </Box>
                </Flex>
            </Flex>
            <Flex w="full" mt={1}>
                <Flex flex={1} borderBottom="1.5px solid gray" pb='3' justifyContent="center" cursor="pointer">
                    <Text fontWeight="bold" color="gray.500">Threads</Text>
                </Flex>
                <Flex flex={1} borderBottom="1.5px solid" pb='3' justifyContent="center" cursor="pointer">
                    <Text fontWeight="semibold" color="gray.500">Replies</Text>
                </Flex>
            </Flex>
        </VStack>
    );
};

export default UserHeader;