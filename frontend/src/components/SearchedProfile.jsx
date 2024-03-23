import { Box, Image, Text, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useDispatch, useSelector } from "react-redux";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { followUser, unfollowUser } from '../redux/authSlice';
import { useNavigate } from "react-router-dom";

const SearchedProfile = ({ userProfile }) => {
    if (!userProfile) return null;
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authUser = useSelector((state) => state.auth.user);
    const isFollowing = userProfile && userProfile.followers && userProfile.followers.includes(authUser?._id);

    const handleFollowAndUnfollow = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/users/follow/${userProfile?._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
            } else {
                if (isFollowing) {
                    dispatch(unfollowUser({ userId: userProfile._id, authUserId: authUser._id }));
                    showToast("Success", data.message, "success");
                } else {
                    dispatch(followUser({ userId: userProfile._id, authUserId: authUser._id }));
                    showToast("Success", data.message, "success");
                }
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {userProfile && (
                <Box borderWidth="1px" borderRadius="lg" borderColor="gray.light" overflow="hidden" mt={3} p={4} mb={4}>
                    <Stack direction="row" spacing={4} align="center">
                        <Image cursor="pointer" borderRadius="full" boxSize="50px" onClick={() => navigate(`/${userProfile.username}`)}
                        src={userProfile.profilePic} alt={userProfile.name} />
                        <Box flex="1">
                            <Text
                            cursor="pointer"
                            fontWeight="bold"
                            onClick={() => navigate(`/${userProfile.username}`)}
                            >{userProfile.username}</Text>
                            <Text fontSize="sm" color="gray.500">{userProfile.followers?.length} followers</Text>
                        </Box>
                        {authUser?._id !== userProfile?._id && (
                            <Box color={"gray.light"} onClick={handleFollowAndUnfollow}>
                                {isFollowing ? <SlUserUnfollow cursor="pointer" size={24} /> : <SlUserFollow cursor="pointer" size={24} />}
                            </Box>
                        )}
                    </Stack>
                </Box>
            )}
        </>
    );
};

export default SearchedProfile;
