import React from "react";
import styled from "styled-components";
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = () => {
    const handleLogin = async (credentialResponse) => {
        const token = credentialResponse.credential;
        console.log("token:", token);

        if (!token) {
            console.error("Token is null");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: token }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                console.log('Login successful:', data);
            } else {
                console.error('Login failed:', await response.json());
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <GoogleLogin
            onSuccess={(credentialResponse) => handleLogin(credentialResponse)}
            onError={() => console.log('Login failed')}
        />
    );
};

export default GoogleLoginButton;
