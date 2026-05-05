import BlurText from '../components/BlurText/BlurText';
import GradientText from '../components/GradientText/GradientText';
import RotatingText from '../components/RotatingText/RotatingText';

export default function Hero() {
  return (
    <section className="hero-section" id="home">
      {/* Floating blobs inspired by the reference */}
      <div className="hero-blobs" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
        <div className="blob blob-5" />
      </div>

      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      <nav className="hero-nav">
        <span className="nav-logo">
          <GradientText colors={['#1d4ed8', '#3b82f6', '#60a5fa', '#2563eb']} animationSpeed={6}>
            Eli.
          </GradientText>
        </span>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot" />
          <span>Available for freelance</span>
        </div>

        <div className="hero-title-block">
          <BlurText
            text="Eli Cubillos"
            delay={90}
            animateBy="letters"
            direction="bottom"
            className="hero-name"
            stepDuration={0.3}
          
          />
        </div>

        <div className="hero-role">
          <span className="hero-role-prefix">Mid</span>
          <RotatingText
            texts={['UI/UX Designer', 'UX Researcher', 'Design Systems', 'E-commerce Architect']}
            rotationInterval={2500}
            staggerDuration={0.03}
            className="hero-role-rotating"
          />
        </div>

        <p className="hero-description">
          Crafting human-centered digital experiences that bridge
          <em> beautiful design </em> with <em> strategic business goals</em>.
          3 years turning complex workflows into meaningful solutions.
        </p>

       
      </div>
    </section>
  );
}
