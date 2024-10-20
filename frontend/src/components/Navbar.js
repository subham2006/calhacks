import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg'

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <a href="/" style={styles.logoContainer}>
          <img src="https://flowbite.com/docs/images/logo.svg" alt="Logo" style={styles.logo} />
          <span style={styles.logoText}>EduPal.ai</span>
        </a>
        <button style={styles.menuButton} aria-controls="navbar-default" aria-expanded="false">
          <span style={styles.srOnly}>Open main menu</span>
          <svg style={styles.menuIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div style={styles.navListContainer} id="navbar-default">
          <ul style={styles.navList}>
            <li style={styles.navItem}><Link to="/" style={styles.navLink}>Home</Link></li>
            <li style={styles.navItem}><Link to="/about" style={styles.navLink}>About</Link></li>
            <li style={styles.navItem}><Link to="/connect" style={styles.navLink}>Connect</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e5e5',
    padding: '10px 0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logo: {
    height: '40px',
    marginRight: '10px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000000',
  },
  menuButton: {
    display: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    border: '0',
  },
  menuIcon: {
    width: '24px',
    height: '24px',
    color: '#000000',
  },
  navListContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  navList: {
    listStyleType: 'none',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: '0 15px',
  },
  navLink: {
    textDecoration: 'none',
    color: '#000000',
    fontWeight: '500',
    fontSize: '16px',
    transition: 'color 0.3s ease',
  },
  navLinkHover: {
    color: '#007bff',
  },
};

export default Navbar;
