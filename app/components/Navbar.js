
const Navbar = () => {
    return (
        <nav style={{ position: 'absolute', top: 0, width: '100%', background: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>
            <ul style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
                <li>Home</li>
                <li>About</li>
                <li>Projects</li>
                <li>Contact</li>
            </ul>
        </nav>
    );
};

export default Navbar;