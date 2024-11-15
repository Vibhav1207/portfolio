// app/page.js
"use client"; 

import Head from 'next/head';
import Navbar from './components/Navbar';
import Stars from './components/Stars';
import About from './components/About';
import Projects from './components/Projects';

const Home = () => {
    return (
        <>
            <Head>
                <title> Portfolio </title>
                <meta name="description" content="A brief description of your portfolio." />
                <meta name="keywords" content="portfolio, web development, projects" />
            </Head>
            <Navbar />
            <Stars />
            <div className="blackhole" />
            <About />
            <Projects />
            <style jsx>{`
                body {
                    background: black;
                    overflow: hidden;
                }

                .blackhole {
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100px;
                    height: 100px;
                    background: radial-gradient(circle, black 30%, transparent 70%);
                    animation: spin 5s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
};

export default Home;