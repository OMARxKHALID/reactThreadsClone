import {
    Button,
    CloseButton,
    Flex,
    FormControl,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { IoImagesOutline } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../redux/postSlice";

const MAX_CHAR = 500;

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const [loading, setLoading] = useState(false);
    const [postText, setPostText] = useState("");
    const imageRef = useRef(null);

    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const showToast = useShowToast();
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const handleTextChange = (e) => {
        const inputText = e.target.value;

        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setPostText(truncatedText);
            setRemainingChar(0);
        } else {
            setPostText(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    };

    const handleCreatePost = async () => {
        setLoading(true);
        try {

            const res = await fetch("/api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
            });

            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                setLoading(false);
                return;
            }

            dispatch(addPost([data]));
            showToast("Success", "Thread created successfully", "success");

            onClose();
            setPostText("");
            setImgUrl("");

        } catch (error) {
            showToast("Error", error.message, "error");
            setLoading(false);
        } finally{
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                size={0}
                colorScheme="none"
                variant="unstyled"
                onClick={onOpen}
            >
                <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 26 26" className="x1lliihq xffa9am x1jwls1v x1n2onr6 x17fnjtu x3egl4o" style={{ fill: 'transparent', height: '25px', width: '25px' }}>
                    <path d="M22.75 13L22.75 13.15C22.75 16.5103 22.75 18.1905 22.096 19.4739C21.5208 20.6029 20.6029 21.5208 19.4739 22.096C18.1905 22.75 16.5103 22.75 13.15 22.75L12.85 22.75C9.48969 22.75 7.80953 22.75 6.52606 22.096C5.39708 21.5208 4.4792 20.6029 3.90396 19.4739C3.25 18.1905 3.25 16.5103 3.25 13.15L3.25 12.85C3.25 9.48968 3.25 7.80953 3.90396 6.52606C4.4792 5.39708 5.39708 4.4792 6.52606 3.90396C7.80953 3.25 9.48968 3.25 12.85 3.25L13 3.25" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                    <path d="M21.75 4.25L13.75 12.25" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                </svg>
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />

                <ModalContent mt={"300px"} bg={"gray.50"} borderRadius="xl">
                    <ModalHeader fontWeight={"bold"} color={"gray.dark"}>New thread</ModalHeader>
                    <ModalCloseButton color={"gray.dark"} />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                color={"gray.light"}
                                placeholder='Post content goes here..'
                                _placeholder={{ color: 'gray.light' }}
                                _focus={{ borderColor: 'gray.light' }}
                                onChange={handleTextChange}
                                value={postText}
                                sx={{
                                    resize: 'vertical',
                                    overflowY: 'hidden',
                                }}
                            />
                            <Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={"gray.dark"}>
                                {remainingChar}/{MAX_CHAR}
                            </Text>

                            <Input type='file' hidden ref={imageRef} onChange={handleImageChange} />

                            <IoImagesOutline
                                style={{ marginLeft: "5px", cursor: "pointer" }}
                                color={"black"}
                                size={25}
                                onClick={() => imageRef.current.click()}
                            />
                        </FormControl>

                        {imgUrl && (
                            <Flex mt={5} w={"full"} position={"relative"}>
                                <Image src={imgUrl} alt='Selected img' />
                                <CloseButton
                                    onClick={() => {
                                        setImgUrl("");
                                    }}
                                    position={"absolute"}
                                    color="black"
                                    variant="unstyled"
                                    size={"xl"}
                                    top={2}
                                    right={2}
                                />
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            borderRadius="2xl"
                            height="14"
                            size="lg"
                            bg={'gray.dark'}
                            color={'gray.light'}
                            _hover={{
                                bg: 'black',
                            }}
                            w={"full"}
                            onClick={handleCreatePost}
                            isLoading={loading}
                            fontWeight={"bold"}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreatePost;
