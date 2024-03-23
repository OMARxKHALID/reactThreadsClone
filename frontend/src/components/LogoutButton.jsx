import { Button } from '@chakra-ui/react';
import { MdLogout } from "react-icons/md";
import useShowToast from '../hooks/useShowToast';
import { useDispatch } from 'react-redux';
import { setLogout } from '../redux/authSlice';
import { emptyPosts } from '../redux/postSlice';
import { setConversations, setMessages, setSelectedConversation } from '../redux/messageSlice';

const LogoutButton = () => {
    const dispatch = useDispatch();
    const showToast = useShowToast();

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", "Logged out successfully", "success");
            dispatch(setLogout(null));
            dispatch(emptyPosts());
            dispatch(setConversations([]));
            dispatch(setMessages([]));
            dispatch(setSelectedConversation(null))
        } catch (error) {
            showToast("Error", error, "error");
        }
    }
    return (
        <Button
            size={0}
            onClick={handleLogout}
            colorScheme="none"
            variant="unstyled"
        >
            <MdLogout size={25} />
        </Button>
    )
}

export default LogoutButton;
