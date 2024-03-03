import { Avatar, Box, Divider, Flex, Text, Image } from "@chakra-ui/react";
import Actions from "./Actions";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";

const Comment = ({ }) => {
    const [liked, setLiked] = useState(false);

    return (
        <>
            <Flex gap={4} py={2} my={2} w={"full"}>
                <Avatar src={"/profile-logo.jpg"} size={"md"} />
                <Flex gap={1} w={"full"} flexDirection={"column"}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontWeight={"bold"} fontSize={"md"}>omarxoxo</Text>
                            <Image src='/verified.png' w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"xm"} color={"gray.light"}>1d</Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>
                    <Text>too good</Text>
                    <Actions liked={liked} setLiked={setLiked} />
                    <Flex gap={2} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize={"sm"}>123 replies</Text>
                        <Box w={0.5} h={0.5} bg={"gray.light"} borderRadius={"full"}></Box>
                        <Text color={"gray.light"} fontSize={"sm"}>456 likes</Text>
                    </Flex>
                </Flex>
            </Flex>
            <Divider borderColor={"gray.light"} />
        </>
    );
};

export default Comment;
