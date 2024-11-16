
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <h1>Vibhav</h1> {/* Logo goes here */}
            </div>
            <div className="menu-icon" onClick={toggleMenu}>
                {isOpen ? <FiX /> : <FiMenu />}
            </div>
            <div className={`nav-links-container ${isOpen ? 'active' : ''}`}>
                <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/projects">Projects</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                </ul>
            </div>
            <div className="social-icons">
                <a href='github link' target='_blank' rel='noopener noreferrer'><FaGithub /></a>
                <a href='linkedin link' target='_blank' rel='noopener noreferrer'><FaLinkedin /></a>
                <a href='twitter link' target='_blank' rel='noopener noreferrer'><FaTwitter /></a>
            </div>
        </nav>
    );
};

export default Navbar;