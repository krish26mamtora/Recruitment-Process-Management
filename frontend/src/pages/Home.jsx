import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home-page">
      <section className="home-hero card">
        <h1>Recruitment Portal</h1>
        <p className="muted">Streamlined hiring for admins, recruiters, and candidates.</p>
        <div className="home-cta">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn btn-secondary">Register</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
