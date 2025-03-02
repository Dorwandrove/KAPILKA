import React, { useState } from 'react';
import { Link, NavLink } from 'react-router'; // שימוש ב- NavLink לניווט דינאמי
import '../styles/Navbar.css';
import { logout } from '../api/auth'; // פונקציה לטיפול ביציאה מהמשתמש

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); // ניהול מצב לתפריט הניווט במובייל

    return (
        <nav className="navbar">
            {/* לוגו שמוביל לעמוד הבית */}
            <Link to="/" className="navbar-logo">
                <img src="/images/logo.webp" alt="logo" width={90} height={90} />
            </Link>

            {/* תפריט הניווט */}
            <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
                {/* קישור לדף הבית */}
                <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    onClick={() => setIsOpen(false)}
                >
                    Home
                </NavLink>

                {/* קישור לדף ההוצאות */}
                <NavLink
                    to="/expenses"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    onClick={() => setIsOpen(false)}>
                    Expenses
                </NavLink>

                {/* קישור לדף ההכנסות */}
                <NavLink
                    to="/incomes"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    onClick={() => setIsOpen(false)}>
                    Incomes
                </NavLink>

                {/* כפתור התנתקות */}
                <NavLink
                    to="#"
                    className={() => { }}
                    onClick={(e) => {
                        e.preventDefault(); // מניעת ניווט מיותר
                        logout(); // קריאה לפונקציית ההתנתקות
                    }}
                >
                    Logout
                </NavLink>
            </div>

            {/* תפריט המבורגר (toggler) למובייל */}
            <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};
