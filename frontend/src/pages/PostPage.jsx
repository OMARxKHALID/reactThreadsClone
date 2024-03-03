import { useState } from 'react';
import { Avatar, Box, Divider, Flex, Image, Text } from "@chakra-ui/react";
import Actions from "../components/Actions";
import { BsThreeDots } from 'react-icons/bs';
import Comment from '../components/Comment';

const PostPage = () => {
  const [liked, setLiked] = useState(false);

  const user = {
    username: "omarxoxo",
    profilePic: "/profile-logo.jpg"
  };

  const currentPost = {
    createdAt: new Date(),
    text: "This is a sample post text.",
    img: "/post1.jpg",
  };

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name={user.username} />
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontWeight={"bold"} fontSize={"md"}>omarxoxo</Text>
              <Image src='/verified.png' w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
              <BsThreeDots />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Text my={3}>{currentPost.text}</Text>
      {currentPost.img && (
        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={2}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>123 replies</Text>
        <Box w={0.5} h={0.5} bg={"gray.light"} borderRadius={"full"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>456 likes</Text>
      </Flex>
      <Divider borderColor={"gray.light"} mt={4} />
      <Comment />
      <Comment />
      <Comment />
    </>
  );
};

export default PostPage;
