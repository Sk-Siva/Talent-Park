const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to Talent Park</h1>
        <p>Where Talent Meets Opportunity</p>
      </header>
      <section className="features">
        <div className="feature-box">
          <h2>🔍 Smart Job Matching</h2>
          <p>AI-powered job recommendations based on your skills.</p>
        </div>
        <div className="feature-box">
          <h2>🛠️ Find Your Job Here</h2>
          <p>Explore thousands of job opportunities that match your expertise.</p>
        </div>
        <div className="feature-box">
          <h2>👨‍💼 Find Job Seekers Here</h2>
          <p>Employers can discover top talent easily and hire the best candidates.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;