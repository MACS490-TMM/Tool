import React, { useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    async function loginUser(credentials) {
        console.log("Credentials to be sent: ", credentials);  // More readable object logging
        return fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
            credentials: 'include',  // Ensures cookies are sent with the request
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(async data => {
            console.log("Response data:", data);
            return data; // Continue passing data
        }).catch(error => {
            console.error('Error:', error);
            throw error; // Re-throw to handle in calling function
        });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const credentials = { username, password }; // Cleaner object construction
            const data = await loginUser(credentials);
            console.log("Data received 1: ", data)
            console.log("Data received 2: ", data.token)
            if (data && data.token) {
                login(data.token);
                navigate('/');
            } else {
                setError('Failed to login');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Login failed. Please try again.');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </label>
            {error && <p>{error}</p>}
            <input type="submit" value="Submit" />
        </form>
    );
}

export default Login;
