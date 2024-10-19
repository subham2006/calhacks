import React from 'react';

function About() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>About Us</header>
      <section style={styles.section}>
        <h2 style={styles.subHeader}>Our Mission</h2>
        <p style={styles.paragraph}>
          We aim to create solutions that inspire, engage, and make a difference in the world.
        </p>
      </section>
      <section style={styles.section}>
        <h2 style={styles.subHeader}>Our Team</h2>
        <p style={styles.paragraph}>
          Meet our passionate team of innovators, developers, and designers committed to building great products.
        </p>
      </section>
      <section style={styles.section}>
        <h2 style={styles.subHeader}>Our Story</h2>
        <p style={styles.paragraph}>
          Started in 2023, we’ve grown from a small group of enthusiasts into a company that values creativity and innovation.
        </p>
      </section>
      <footer style={styles.footer}>
        <p>&copy; 2024 My Company. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  header: {
    fontSize: '36px',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: '40px',
  },
  subHeader: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.6',
  },
  footer: {
    marginTop: '40px',
    fontSize: '14px',
    color: '#888',
  },
};

export default About;
