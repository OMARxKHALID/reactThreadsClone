import { useSelector } from 'react-redux';
import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";

const Message = ({ ownMessage, message }) => {
    const selectedConversation = useSelector(state => state.message.selectedConversation);
    const authUser = useSelector((state) => state.auth.user);
    const [imgLoaded, setImgLoaded] = useState(false);

    const shouldRenderTextBubble = message.text && message.text !== "image";

    return (
        <>
            {ownMessage ? (
                <Flex gap={2} alignSelf={"flex-end"}>
                    {shouldRenderTextBubble && (
                        <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
                            <Text color={"white"}>{message.text}</Text>
                            <Box
                                alignSelf={"flex-end"}
                                ml={1}
                                color={message.seen ? "blue.400" : ""}
                                fontWeight={"bold"}
                            >
                                <BsCheck2All size={16} />
                            </Box>
                        </Flex>
                    )}
                    {message.img && !imgLoaded && (
                        <Flex mt={5} w={"100px"}>
                            <Image
                                src={message.img}
                                hidden
                                onLoad={() => setImgLoaded(true)}
                                alt='Message image'
                                borderRadius={4}
                                w="100px"
                                h="100px"
                            />
                            <Skeleton w={"100px"} h={"100px"} />
                        </Flex>
                    )}

                    {message.img && imgLoaded && (
                        <Flex mt={5} w={"100px"}>
                            <Image src={message.img} alt='Message image' borderRadius={4} w="100px" h="100px" />
                            <Box
                                alignSelf={"flex-end"}
                                ml={1}
                                color={message.seen ? "blue.400" : ""}
                                fontWeight={"bold"}
                            >
                                <BsCheck2All size={16} />
                            </Box>
                        </Flex>
                    )}

                    <Avatar src={authUser.profilePic} w='7' h={7} />
                </Flex>
            ) : (
                <Flex gap={2}>
                    <Avatar src={selectedConversation.userProfilePic} w='7' h={7} />

                    {shouldRenderTextBubble && (
                        <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"}>
                            {message.text}
                        </Text>
                    )}
                    {message.img && !imgLoaded && (
                        <Flex mt={5} w={"100px"}>
                            <Image
                                src={message.img}
                                hidden
                                onLoad={() => setImgLoaded(true)}
                                alt='Message image'
                                borderRadius={4}
                                w="100px"
                                h="100px"
                            />
                            <Skeleton w={"100px"} h={"100px"} />
                        </Flex>
                    )}

                    {message.img && imgLoaded && (
                        <Flex mt={5} w={"100px"}>
                            <Image src={message.img} alt='Message image' borderRadius={4} w="100px" h="100px" />
                        </Flex>
                    )}
                </Flex>
            )}
        </>
    );
};

export default Message;
