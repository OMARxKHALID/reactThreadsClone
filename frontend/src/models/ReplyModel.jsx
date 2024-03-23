import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, Input, Button } from '@chakra-ui/react';

const ReplyModal = ({ isOpen, onClose, handleReply, isReplying, reply, setReply }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent w={'400px'} mt={'200px'} bg={'gray.50'} borderRadius="xl">
                <ModalHeader></ModalHeader>
                <ModalCloseButton color={'gray.dark'} />
                <ModalBody pb={6}>
                    <FormControl>
                        <Input
                            color={'gray.light'}
                            _placeholder={{ color: 'gray.light' }}
                            _focus={{ borderColor: 'gray.light' }}
                            placeholder="Reply goes here.."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                        />
                    </FormControl>
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
                        w={'full'}
                        isLoading={isReplying}
                        onClick={handleReply}
                        fontWeight={'bold'}>
                        Post
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ReplyModal;