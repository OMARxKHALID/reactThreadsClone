import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, WrapItem, useColorModeValue } from "@chakra-ui/react";
import { BsCheck2All } from "react-icons/bs";
import { RiImageFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedConversation } from "../../redux/messageSlice";

const Conversation = ({ conversation, isOnline }) => {
    const authUser = useSelector((state) => state.auth.user);
    const selectedConversation = useSelector((state) => state.message.selectedConversation);
    const dispatch = useDispatch();

    const user = conversation.participants[0];
    const lastMessage = conversation.lastMessage;

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };
    
    if (!user) return;

    const renderLastMessage = () => {
        if (lastMessage.text === 'image') {
            return (
                <>
                    {authUser._id === lastMessage.sender && (
                        <Box color={lastMessage.seen ? "blue.400" : ""}>
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
                        <Box color={lastMessage.seen ? "blue.400" : ""}>
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
        </Flex>
    );
};

export default Conversation;
