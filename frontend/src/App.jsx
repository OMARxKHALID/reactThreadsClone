import { Box, Container } from '@chakra-ui/react';
import {  Navigate, Route, Routes } from 'react-router-dom';
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';
import Header from './components/Header';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import { useSelector } from 'react-redux';
import UpdateProfilePage from './pages/UpdateProfilePage';
import ChatPage from './pages/ChatPage';

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
      <Box position={"relative"} w='full'
        {...(user ? {} : {
          backgroundImage: "url('/bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          pt: 6
        })}
      >
        <Container maxW= "800px">
          <Header/>
          <Routes>
            <Route
              path='/'
              element={user ? <HomePage /> : <Navigate to="/auth" replace />}
            />
            <Route path='/auth' element={user ? <Navigate to="/" replace /> : <AuthPage />} />
            <Route path='/update' element={!user ? <Navigate to="/auth" replace /> : <UpdateProfilePage />} />

            <Route path='/:username' element={!user ? <Navigate to="/auth" replace /> : <UserPage />} />
            <Route path='/:username/post/:pid' element={!user ? <Navigate to="/auth" replace /> : <PostPage />} />
            <Route path='/chat' element={!user ? <Navigate to="/auth" replace /> : <ChatPage />} />
            <Route path='/*' element={<Navigate to="/auth" replace />} />
          </Routes>
        </Container>
      </Box>
  );
}

export default App;
