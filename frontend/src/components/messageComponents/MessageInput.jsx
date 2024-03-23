import {
    Flex,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
} from "@chakra-ui/react";
import { IoSendSharp } from "react-icons/io5";
import { BsFillImageFill } from "react-icons/bs";
import { addMessage, setConversations } from "../../redux/messageSlice";
import useShowToast from "../../hooks/useShowToast";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import usePreviewImg from "../../hooks/usePreviewImg";
import { useSocket } from "../../context/SocketContext";

const MessageInput = () => {
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false); 
    const showToast = useShowToast();
    const dispatch = useDispatch();
    const selectedConversation = useSelector((state) => state.message.selectedConversation);
    const conversations = useSelector((state) => state.message.conversations);
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const { onClose } = useDisclosure();
    const imageRef = useRef(null);
    const { socket } = useSocket();

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setLoading(true); 
        if (!messageText && !imgUrl) {
            showToast("Error", "Please enter a message or select an image", "error");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: messageText || "image", 
                    recipientId: selectedConversation.userId,
                    img: imgUrl,
                }),
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            dispatch(addMessage(data));

            const updatedConversations = conversations.map(conversation => {
                if (conversation.participants[0]?._id === selectedConversation.userId) {
                    return {
                        ...conversation,
                        lastMessage: {
                            text: messageText || "image", 
                            sender: data.sender,
                        },
                    };
                }
                return conversation;
            });
            dispatch(setConversations(updatedConversations));
            setMessageText("");
            setImgUrl("");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setLoading(false); 
        }
    };
    
    const handleTyping = () => {
        if (selectedConversation) {
            socket.emit("typing", { conversationId: selectedConversation._id, userId: selectedConversation.userId });
        }
    };

    const handleStopTyping = () => {
        if (selectedConversation) {
            socket.emit("stopTyping", { conversationId: selectedConversation._id, userId: selectedConversation.userId });
        }
    };

    return (
        <Flex gap={2} alignItems={"center"}>
            <form style={{ flex: 95 }} onSubmit={handleSendMessage}>
                <InputGroup>
                    <Input
                        w={"full"}
                        placeholder='Type a message'
                        value={messageText}
                        onChange={(e) => {
                            setMessageText(e.target.value);
                            handleTyping(); 
                        }}
                        onBlur={handleStopTyping} 
                    />
                    <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
                        {loading ? <Spinner size="sm" /> : <IoSendSharp />}
                    </InputRightElement>
                </InputGroup>
            </form>
            <Flex flex={5} cursor={"pointer"}>
                <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
                <Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
            </Flex>
            <Modal
                isOpen={imgUrl}
                onClose={() => {
                    onClose();
                    setImgUrl("");
                }}
            >
                <ModalOverlay />
                <ModalContent bg={"gray.dark"}>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex mt={3} w={"full"}>
                            <Image src={imgUrl} />
                        </Flex>
                        <Flex justifyContent={"flex-end"} my={2}>
                            {loading ? <Spinner size="sm" /> :
                                <IoSendSharp size={20} cursor={"pointer"} onClick={handleSendMessage} />
                            }
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default MessageInput;
