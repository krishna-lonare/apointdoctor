export default function Hero() {
  return (
    <header id="hero" className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Premium Healthcare <br/><span>At Your Fingertips</span></h1>
          <p className="hero-subtitle">Experience a seamless and modern way to book your doctor appointments. Fast, secure, and reliable.</p>
          <div className="hero-actions">
            <a href="#book" className="btn btn-primary">Book Now</a>
            <a href="#check-status" className="btn btn-secondary">Check Status</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="glass-card">
            <div className="pulse-ring"></div>
            <div className="card-icon">🩺</div>
            <h3>Top Rated Specialists</h3>
            <p>Book with the best doctors in the city.</p>
          </div>
        </div>
      </div>
    </header>
  );
}
