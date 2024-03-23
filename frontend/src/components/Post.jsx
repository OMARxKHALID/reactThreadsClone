import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, Divider, Flex, Image, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import Actions from './Actions';
import useShowToast from '../hooks/useShowToast';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns'
import { DeleteIcon } from '@chakra-ui/icons';
import { setPosts } from '../redux/postSlice';
import { isValid, parseISO } from 'date-fns';

const Post = ({ post, postedBy }) => {
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.auth.user);
    const posts = useSelector((state) => state.post.posts);

    const createdAtDate = isValid(new Date(post?.createdAt)) ? parseISO(post.createdAt) : null;
    const distanceToNow = createdAtDate ? formatDistanceToNow(createdAtDate) : "";

    useEffect(() => {
        const getUserProfile = async () => {
            if(!postedBy) return null;
            try {
                const res = await fetch(`/api/users/profile/${postedBy}`);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setUser(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                setUser(null);
            }
        };
        getUserProfile();
    }, [postedBy, showToast, setUser]);


    const handleDeletePost = async (e) => {
        try {
            e.preventDefault();
            if (!window.confirm("Are you sure you want to delete this thread?")) return;
            const res = await fetch(`/api/posts/${post._id}`, {
                method: "DELETE",
            })
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            dispatch(setPosts(posts.filter((p) => p._id !== post._id)));
            showToast("Success", "thread deleted successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    }

    if(!user) return;

    return (
        <Link to={`/${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size={"md"} src={user.profilePic}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${user.username}`);
                        }
                        }
                    />
                    <Box w='1px' h={"full"} bg="gray.light" my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        {post?.replies && post?.replies?.length > 0 && (
                            <>
                                {post.replies[0] && (
                                    <Avatar src={post.replies[0].userProfilePic} size='xs' position={"absolute"} left={"50%"} transform={"translate(-50%, -50%)"} padding={"2px"} top={'18px'} />
                                )}
                                {post.replies[1] && (
                                    <Avatar size='xs' src={post.replies[1].userProfilePic} position={"absolute"} right={"-3px"} padding={"2px"} top={'50%'} transform={"translateY(-50%)"} />
                                )}
                                {post.replies[2] && (
                                    <Avatar size='xs' src={post.replies[2].userProfilePic} position={"absolute"} left={"-3px"} padding={"2px"} top={'50%'} transform={"translateY(-50%)"} />
                                )}
                            </>
                        )}

                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontWeight={"bold"} fontSize={"md"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${user.username}`);
                                }}
                            >{user.username}</Text>
                            <Image src='/verified.png' w={4} h={4} ml={1} />
                        </Flex>
                        <Flex alignItems={"center"}>
                            <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>{distanceToNow}</Text>

                            {authUser?._id === user._id && <DeleteIcon ml={2} cursor="pointer" size={20} color={"gray.light"} onClick={handleDeletePost} />}
                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"}>{post.text}</Text>
                    {post.img && (<Box borderRadius={5} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                        <Image src={post.img} w={"full"} h={"full"} />
                    </Box>)}
                    <Flex>
                        <Actions post={post} />
                    </Flex>
                    <Divider borderColor={"gray.light"} mt={4} />
                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;
