import { Flex, Grid, Image, Link, useColorMode } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RxAvatar } from 'react-icons/rx';
import { AiFillHome } from 'react-icons/ai';
import LogoutButton from './LogoutButton';
import { GrChat } from "react-icons/gr";
import { FiSearch } from "react-icons/fi";
import CreatePostModel from "../models/CreatePostModel";

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const user = useSelector((state) => state.auth.user);

    return (
        <Flex alignItems="center" justifyContent="space-between" mt={6} mb={12}>
            <Flex alignItems="center" gap={4}>
                {user && (
                    <Link as={RouterLink} to="/">
                        <AiFillHome size={25} />
                    </Link>
                )}
                {user && <CreatePostModel />}
                {user && (
                    <Link as={RouterLink} to="/search">
                        <FiSearch size={25} />
                    </Link>
                )}
            </Flex>

            <Grid placeItems="center">
                <Image
                    cursor="pointer"
                    alt='logo'
                    w={8}
                    src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
                    onClick={toggleColorMode}
                />
            </Grid>

            <Flex alignItems="center" gap={4}>
                {user && (
                    <Link as={RouterLink} to={`/chat`}>
                        <GrChat size={20} />
                    </Link>
                )}
                {user && (
                    <Link as={RouterLink} to={`/${user?.username}`}>
                        <RxAvatar size={25} />

                    </Link>
                )}
                {user && (
                    <LogoutButton />
                )}
            </Flex>
        </Flex>
    );
};

export default Header;
