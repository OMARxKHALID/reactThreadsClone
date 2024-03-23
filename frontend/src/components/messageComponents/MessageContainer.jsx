import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import useShowToast from "../../hooks/useShowToast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { setConversations, setMessages } from "../../redux/messageSlice";
import { useSocket } from "../../context/SocketContext";
import messageSound from "../../assets/message.mp3";

const MessageContainer = () => {
    const showToast = useShowToast();
    const dispatch = useDispatch();
    const selectedConversation = useSelector((state) => state.message.selectedConversation);
    const conversations = useSelector((state) => state.message.conversations);
    const messages = useSelector((state) => state.message.messages);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const authUser = useSelector((state) => state.auth.user);
    const { socket } = useSocket();
    const messageEndRef = useRef(null);
    const [typingIndicator, setTypingIndicator] = useState([]);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        const handleTyping = ({ conversationId, userId }) => {
            if (selectedConversation && conversationId === selectedConversation._id) {
                setTypingIndicator((prevTypingUsers) => {
                    if (!prevTypingUsers.includes(userId)) {
                        return [...prevTypingUsers, userId];
                    }
                    return prevTypingUsers;
                });
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => {
                    setTypingIndicator((prevTypingUsers) => prevTypingUsers.filter((user) => user !== userId));
                }, 1000);
            }
        };

        const handleStopTyping = ({ conversationId, userId }) => {
            if (selectedConversation && conversationId === selectedConversation._id) {
                setTypingIndicator((prevTypingUsers) => prevTypingUsers.filter((user) => user !== userId));
            }
        };

        socket?.on("typing", handleTyping);
        socket?.on("stopTyping", handleStopTyping);

        return () => {
            socket?.off("typing", handleTyping);
            socket?.off("stopTyping", handleStopTyping);
        };
    }, [socket, selectedConversation, setTypingIndicator]);

    useEffect(() => {
        const handleNewMessage = (message) => {
            if (selectedConversation && selectedConversation._id === message.conversationId) {
                dispatch(setMessages([...messages, message]));
            }

            if (!document.hasFocus()) {
                const sound = new Audio(messageSound);
                sound.play();
            }

            const updatedConversations = conversations.map((conversation) => {
                if (conversation._id === message.conversationId) {
                    return {
                        ...conversation,
                        lastMessage: {
                            text: message.text,
                            sender: message.sender,
                        },
                    };
                }
                return conversation;
            });
            dispatch(setConversations(updatedConversations));
        };

        socket?.on("newMessage", handleNewMessage);

        return () => {
            socket?.off("newMessage", handleNewMessage);
        };
    }, [socket, selectedConversation, messages, dispatch, conversations]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                setLoadingMessages(true);
                if (!selectedConversation) return;
                if (selectedConversation.mock){
                    dispatch(setMessages([]));

                }
                const res = await fetch(`/api/messages/${selectedConversation.userId}`);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                } else {
                    dispatch(setMessages(data));
                }
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoadingMessages(false);
            }
        };

        getMessages();

    }, [selectedConversation, showToast, dispatch]);

    useEffect(() => {
        if (!selectedConversation) return;

        const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== authUser._id;
        if (lastMessageIsFromOtherUser) {
            socket?.emit("markMessagesAsSeen", {
                conversationId: selectedConversation._id,
                userId: selectedConversation.userId,
            });
        }

        const handleMessagesSeen = ({ conversationId }) => {
            if (selectedConversation._id === conversationId) {
                dispatch(
                    setMessages(messages.map((message) => {
                        if (!message.seen) {
                            return {
                                ...message,
                                seen: true
                            }
                        }
                        return message;
                    }))
                );
            }
        };

        socket?.on("messagesSeen", handleMessagesSeen);

        return () => {
            socket?.off("messagesSeen", handleMessagesSeen);
        };
    }, [socket, authUser._id, messages, selectedConversation, dispatch]);

    return (
        <Flex
            flex='70'
            bg={useColorModeValue("gray.200", "gray.dark")}
            borderRadius={"md"}
            p={2}
            flexDirection={"column"}
        >
            {selectedConversation && (
                <>
                    <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
                        <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
                        <Text display={"flex"} alignItems={"center"}>
                            {selectedConversation?.username} <Image src='/verified.png' w={4} h={4} ml={1} />
                        </Text>
                        <Flex flexDirection={"column"} gap={2} p={2}>
                            {typingIndicator.map((userId) => (
                                <Flex key={userId} alignItems="center">
                                    <div class="ticontainer">
                                        <div class="tiblock">
                                            <div class="tidot"></div>
                                            <div class="tidot"></div>
                                            <div class="tidot"></div>
                                        </div>
                                    </div>
                                </Flex>
                            ))}
                        </Flex>
                    </Flex>
                    <Divider />
                    <Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"}>
                        {loadingMessages && !selectedConversation.mock &&
                            [...Array(5)].map((_, i) => (
                                <Flex
                                    key={i}
                                    gap={2}
                                    alignItems={"center"}
                                    p={1}
                                    borderRadius={"md"}
                                    alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
                                >
                                    {i % 2 === 0 && <SkeletonCircle size={7} />}
                                    <Flex flexDir={"column"} gap={2}>
                                        <Skeleton h='8px' w='250px' />
                                        <Skeleton h='8px' w='250px' />
                                        <Skeleton h='8px' w='250px' />
                                    </Flex>
                                    {i % 2 !== 0 && <SkeletonCircle size={7} />}
                                </Flex>
                            ))}

                        {!loadingMessages &&
                            messages.map((message) => (
                                <Flex
                                    key={message._id}
                                    direction={"column"}
                                    ref={messageEndRef}
                                >
                                    <Message key={message._id} message={message} ownMessage={authUser._id === message.sender} />
                                </Flex>
                            ))}

                        {!loadingMessages && messages?.length === 0 &&
                            <Text fontSize={"sm"} color={"gray.light"} textAlign="center">No messages to display.</Text>
                        }
                    </Flex>
                </>
            )}

            <MessageInput />
        </Flex>
    );
};

export default MessageContainer;
