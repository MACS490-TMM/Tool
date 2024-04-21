import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./UserPage.css"; // Import the CSS file

function useGetName() {
    const { getUserName } = useAuth();
    const [userName, setUserName] = useState("Loading...");

    useEffect(() => {
        setUserName(getUserName() || "No user name");
    }, [getUserName]);

    return userName;
}

function useRole() {
    const { getUserRole } = useAuth();
    const [role, setRole] = useState("Loading...");

    useEffect(() => {
        setRole(getUserRole() || "No role assigned");
    }, [getUserRole]);

    return role;
}

function UserPage() {
    const userName = useGetName();
    const role = useRole();
    const { logout } = useAuth();

    return (
        <div className="user-page-container">
            <h1 className="heading">User Details</h1>
            <div className="user-info-block">
                <div className="user-info">
                    <span className="label">Username:</span>
                    <span>{userName}</span>
                </div>
                <div className="user-info">
                    <span className="label">Role:</span>
                    <span>{role}</span>
                </div>
                <button onClick={logout}>Logout</button>
            </div>
        </div>
    );
}

export default UserPage;
