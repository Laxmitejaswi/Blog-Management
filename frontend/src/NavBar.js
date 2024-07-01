import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const NavBar = ({ isLoggedIn, setIsLoggedIn }) => {
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
    };

    useEffect(() => {
        const token = localStorage.getItem('isLoggedIn');
        const username = localStorage.getItem('username');
        if (token && username) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [setIsLoggedIn]);

    return (
        <nav>
            <ul className="outer">
                <li className="title">
                    Blogs
                    <div className="icon"><i className="fa-brands fa-blogger"></i></div>
                </li>
                {isLoggedIn && (
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                )}
                <li>
                    <Link to="/">Articles</Link>
                </li>
                <li>
                    {isLoggedIn ? (
                        <Link to="/login" onClick={handleLogout}>
                            Logout
                        </Link>
                    ) : (
                        <Link to="/login">
                            Login
                        </Link>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
