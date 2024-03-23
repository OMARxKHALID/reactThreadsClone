import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, WrapItem, useColorModeValue, Spinner } from "@chakra-ui/react";
import { BsCheck2All } from "react-icons/bs";
import { RiImageFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { setConversations, setMessages, setSelectedConversation } from "../../redux/messageSlice";
import useShowToast from "../../hooks/useShowToast";
import { DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";

const Conversation = ({ conversation, isOnline }) => {
    const authUser = useSelector((state) => state.auth.user);
    const selectedConversation = useSelector((state) => state.message.selectedConversation);
    const dispatch = useDispatch();
    const conversations = useSelector((state) => state.message.conversations);
    const messages = useSelector((state) => state.message.messages);

    const [isDeleting, setIsDeleting] = useState(false);

    const showToast = useShowToast();

    const handleDeleteConversationsWithMessages = async () => {
        if (!user || !conversation) return null;

        try {
            setIsDeleting(true);
            const res = await fetch(`/api/messages/delete/${conversation._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (data.error) {
                showToast("Error", data.error, "error");
                setIsDeleting(false);
                return;
            } else {
                showToast("Success", data.message, "success");
                const updatedConversations = conversations.filter((con) => con._id !== conversation._id);
                const updatedMessages = messages.filter((msg) => msg.conversationId !== conversation._id);
                if (selectedConversation) {
                    const updatedselectedConversation = selectedConversation._id === conversation._id ? null : selectedConversation;
                    dispatch(setSelectedConversation(updatedselectedConversation));
                }
                dispatch(setMessages(updatedMessages));
                dispatch(setConversations(updatedConversations));
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsDeleting(false);
        }
    };

    const user = conversation.participants[0];
    const lastMessage = conversation.lastMessage;

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    const renderLastMessage = () => {
        if (lastMessage.text === 'image') {
            return (
                <>
                    {authUser._id === lastMessage.sender && (
                        <Box as="span" color={lastMessage.seen ? "blue.400" : ""}>
                            <BsCheck2All size={16} />
                        </Box>
                    )}
                    <RiImageFill size={16} />
                </>
            );
        } else {
            return (
                <>
                    {authUser._id === lastMessage.sender && (
                        <Box as="span" color={lastMessage.seen ? "blue.400" : ""}>
                            <BsCheck2All size={16} />
                        </Box>
                    )}
                    {truncateText(lastMessage.text, 10)}
                </>
            );
        }
    };


    return (
        <Flex
            gap={4}
            alignItems={"center"}
            p={"1"}
            bg={selectedConversation?._id === conversation._id ? useColorModeValue("gray.300", "gray.dark") : ""}
            _hover={{
                cursor: "pointer",
                bg: useColorModeValue("gray.300", "gray.dark"),
            }}
            borderRadius={"md"}
            onClick={() =>
                dispatch(setSelectedConversation({
                    _id: conversation._id,
                    userId: user._id,
                    userProfilePic: user.profilePic,
                    username: user.username,
                    mock: conversation.mock,
                }))
            }
        >
            <WrapItem>
                <Avatar
                    size={{
                        base: "sm",
                        sm: "sm",
                        md: "md",
                    }}
                    src={user.profilePic}
                >
                    {isOnline ? <AvatarBadge boxSize='1em' bg='green.500' /> : ""}
                </Avatar>
            </WrapItem>

            <Stack direction={"column"} fontSize={"sm"}>
                <Text fontWeight='700' display={"flex"} alignItems={"center"}>
                    {user.username} <Image src='/verified.png' w={4} h={4} ml={1} />
                </Text>
                <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
                    {renderLastMessage()}
                </Text>
            </Stack>
            {
                !conversation?.mock && (
                    isDeleting ? (
                        <Spinner size="sm" color={"gray.light"} marginLeft="10px" />
                    ) : (
                        <DeleteIcon
                            marginLeft="auto"
                            marginBottom="auto"
                            _hover={{
                                color: "gray.700",
                            }}
                            color={"gray.light"}
                            onClick={handleDeleteConversationsWithMessages}
                            cursor={"pointer"}
                        />
                    )
                )
            }
        </Flex>
    );
};

export default Conversation;
