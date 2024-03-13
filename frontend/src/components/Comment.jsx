import { Avatar, Divider, Flex, Text, Image } from "@chakra-ui/react";

const Comment = ({ reply, lastReply }) => {

    return (
        <>
            <Flex gap={4} py={2} my={2} w={"full"}>
                <Avatar src={reply?.userProfilePic} size={"md"} />
                <Flex gap={1} w={"full"} flexDirection={"column"}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontWeight={"bold"} fontSize={"md"}>{reply?.username}</Text>
                            <Image src='/verified.png' w={4} h={4} ml={1} />
                        </Flex>
                    </Flex>
                    <Text>{reply?.text}</Text>
                </Flex>
            </Flex>
            {!lastReply ? <Divider borderColor={"gray.light"} /> : null}
        </>
    );
};

export default Comment;
