import { Box, Input, InputGroup, InputRightElement, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import SearchedProfile from "../components/SearchedProfile";
import useShowToast from "../hooks/useShowToast";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "../redux/authSlice";

const SearchPage = () => {
    const showToast = useShowToast();
    const [username, setUsername] = useState("");
    const dispatch = useDispatch();
    const userProfile = useSelector((state) => state.auth.userProfile);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        dispatch(setUserProfile(null));
    }, [setUserProfile, dispatch]);

    const getUser = async () => {
        if (username === "") {
            showToast("Error", "Please enter a username", "error");
            return;
        }
        setIsSearching(true);
        try {
            dispatch(setUserProfile(null));
            const res = await fetch(`/api/users/profile/${username}`);
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            dispatch(setUserProfile(data));
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <>
            <Box px={8}>
                <InputGroup>
                    <Input
                        borderRadius="2xl"
                        height="14"
                        size="lg"
                        color={'gray.light'}
                        borderColor={'gray.dark'}
                        placeholder="Search any user..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <InputRightElement
                        cursor={"pointer"}
                        onClick={getUser}
                        height="14"
                        color="gray.light"
                        marginRight={"5px"}
                    >
                        {isSearching ? <Spinner size={"sm"}/> : <FiSearch size={22} />}
                    </InputRightElement>
                </InputGroup>
                {userProfile ? <SearchedProfile userProfile={userProfile} /> : null}
            </Box>
        </>
    );
};

export default SearchPage;
