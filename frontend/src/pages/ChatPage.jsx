import { useState, useEffect } from 'react';
import { Box, Flex, Input, InputGroup, InputRightElement, Skeleton, SkeletonCircle, Spinner, Text } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { PiChats } from "react-icons/pi";
import Conversation from '../components/messageComponents/Conversation';
import MessageContainer from '../components/messageComponents/MessageContainer';
import useShowToast from '../hooks/useShowToast';
import { useDispatch, useSelector } from 'react-redux';
import { setConversations, setSelectedConversation } from '../redux/messageSlice';
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [searchingUser, setSearchingUser] = useState(false);

    const showToast = useShowToast();
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.auth.user);
    const conversations = useSelector((state) => state.message.conversations);
    const selectedConversation = useSelector((state) => state.message.selectedConversation);

    const { socket, onlineUsers } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleSocketMessagesSeen = ({ conversationId }) => {
            const updatedConversations = conversations.map(conversation => {
                if (conversation?._id === conversationId) {
                    return {
                        ...conversation,
                        lastMessage: {
                            ...conversation.lastMessage,
                            seen: true,
                        },
                    };
                }
                return conversation;
            });
            dispatch(setConversations(updatedConversations));
        };

        socket.on("messagesSeen", handleSocketMessagesSeen);

        return () => {
            socket.off("messagesSeen", handleSocketMessagesSeen);
        };
    }, [socket, conversations, dispatch]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await fetch("/api/messages/conversations");
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                } else {
                    dispatch(setConversations(data));
                }
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoadingConversations(false);
            }
        };
        getConversations();

        if (selectedConversation) {
            dispatch(setSelectedConversation(null))
        }
    }, [showToast, dispatch, setSelectedConversation]);

    const handleConversationSearch = async (e) => {
        e.preventDefault();
        if (searchingUser) return;

        setSearchingUser(true);

        if (searchText.trim() === "") {
            showToast("Error", "Please enter a username", "error");
            setSearchingUser(false);
            return;
        }

        try {
            const res = await fetch(`/api/users/profile/${searchText}`);
            const searchedUser = await res.json();
            if (searchedUser.error) {
                showToast("Error", searchedUser.error, "error");
                return;
            }

            const messagingYourself = searchedUser?._id === authUser?._id;
            if (messagingYourself) {
                showToast("Error", "You cannot message yourself", "error");
                return;
            }

            if (searchText === selectedConversation?.username) {
                showToast("Info", "User is already exist in the conversation", "info");
                return;
            }

            const conversationAlreadyExists = conversations.find(
                (conversation) => conversation?.participants && conversation?.participants[0]?._id === searchedUser?._id
            );

            if (conversationAlreadyExists) {
                dispatch(setSelectedConversation({
                    _id: conversationAlreadyExists?._id,
                    userId: searchedUser?._id,
                    username: searchedUser.username,
                    userProfilePic: searchedUser.profilePic,
                }));
                return;
            }

            showToast("Info", "Starting a new conversation...", "info");

            const mockConversation = {
                mock: true,
                lastMessage: {
                    text: "",
                    sender: "",
                },
                _id: Date.now(),
                participants: [
                    {
                        _id: searchedUser?._id,
                        username: searchedUser.username,
                        profilePic: searchedUser.profilePic,
                    },
                ],
            };

            dispatch(setConversations([...conversations, mockConversation]));
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setSearchingUser(false);
        }
    };

    return (
        <Box
            position="absolute"
            left="50%"
            w={{ base: "100%", md: "80%", lg: "750px" }}
            p={1}
            transform="translateX(-50%)"
        >
            <Flex
                gap={4}
                flexDirection={{ base: "column", md: "row" }}
                maxW={{ sm: "400px", md: "full" }}
                mx="auto"
            >
                <Flex flex={30} gap={2} flexDirection="column" maxW={{ sm: "300px", md: "full" }} mx="auto">
                    <Text fontWeight="bold" fontSize="md">
                        Your Conversations
                    </Text>
                    <form onSubmit={handleConversationSearch}>
                        <Flex alignItems="center" gap={2}>
                            <InputGroup>
                                <Input
                                    onChange={(e) => setSearchText(e.target.value)}
                                    placeholder="Search for a user"
                                />
                                <InputRightElement>
                                    {searchingUser ? (
                                        <Spinner size={"sm"} />
                                    ) : (
                                        <SearchIcon
                                            color="gray.light"
                                            cursor="pointer"
                                            onClick={handleConversationSearch}
                                        />
                                    )}
                                </InputRightElement>
                            </InputGroup>
                        </Flex>
                    </form>
                    {loadingConversations ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <Flex key={i} gap={4} alignItems="center" p="1" borderRadius="md">
                                <SkeletonCircle size="10" />
                                <Flex w="full" flexDirection="column" gap={3}>
                                    <Skeleton h="10px" w="80px" />
                                    <Skeleton h="8px" w="90%" />
                                </Flex>
                            </Flex>
                        ))
                    ) : conversations.length === 0 ? (
                            <Flex justifyContent="center" alignItems="center">
                            <Text fontSize={15}>No conversation found.</Text>
                            </Flex>
                    ) : (
                        conversations.map((conversation) => (
                            <Conversation
                                key={conversation?._id}
                                isOnline={onlineUsers.includes(conversation?.participants[0]?._id)}
                                conversation={conversation}
                            />
                        ))
                    )}
                </Flex>
                {!selectedConversation || !selectedConversation?._id ? (
                    <Flex flex={70} flexDirection="column" borderRadius="md" p={2}>
                        <Flex flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                            <PiChats size={100} />
                            <Text fontSize={15}>Select a conversation to start messaging</Text>
                        </Flex>
                    </Flex>
                ) : (
                    <MessageContainer />
                )}
            </Flex>
        </Box>
    );
};

export default ChatPage;
