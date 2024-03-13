import React from 'react';
import { useSelector } from 'react-redux';
import LoginCard from '../components/LoginCard';
import SignupCard from '../components/SignupCard';

const AuthPage = () => {
    const state = useSelector((state) => state.auth.isState); 
    return (
        <>
            {state === 'login' ? <LoginCard /> : <SignupCard />}
        </>
    );
};

export default AuthPage;
