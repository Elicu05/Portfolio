import AnimatedContent from '../components/AnimatedContent/AnimatedContent';
import BlurText from '../components/BlurText/BlurText';
import GradientText from '../components/GradientText/GradientText';
import Magnet from '../components/Magnet/Magnet';

export default function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-blobs" aria-hidden="true">
        <div className="blob blob-contact-1" />
        <div className="blob blob-contact-2" />
      </div>

      <div className="section-container">
        <AnimatedContent distance={40} duration={0.9}>
          <div className="contact-content">
            <span className="contact-eyebrow">Let's collaborate</span>

            <BlurText
              text="Let's make more magic together."
              delay={80}
              animateBy="words"
              direction="bottom"
              className="contact-headline"
              stepDuration={0.4}
            />

            <p className="contact-subtext">
              I'm always excited to take on new challenges and bring
              creative visions to life. Whether it's a full design system,
              an e-commerce redesign, or a fresh brand identity — let's talk.
            </p>

            <div className="contact-ctas">
              <Magnet padding={100} magnetStrength={3}>
                <a href="mailto:Elipinkboy@gmail.com" className="btn-primary btn-large">
                  <GradientText colors={['#ffffff', '#dbeafe', '#ffffff']} animationSpeed={4}>
                    Send A Message
                  </GradientText>
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </Magnet>
            </div>

            <div className="contact-links">
              <a href="https://behance.net/elicubillos" target="_blank" rel="noopener noreferrer" className="contact-link">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zM9.689 15.045c0-2.396-1.607-2.812-3.23-2.812H2V21h4.5c1.822 0 3.189-1.236 3.189-2.955 0-1.068-.384-2.109-1.609-2.523V15.045zM4.5 14.24h1.757c.662 0 1.207.258 1.207 1.077 0 .765-.505 1.119-1.207 1.119H4.5V14.24zm1.514 5.755H4.5v-2.496h1.6c.795 0 1.4.356 1.4 1.269 0 .903-.608 1.227-1.486 1.227zM9.689 5.108c0-1.89-1.325-3.108-3.189-3.108H2v8h4.5c1.859 0 3.189-1.218 3.189-3.108zm-2.5.015c0 .808-.493 1.368-1.3 1.368H4.5V3.745h1.389c.807 0 1.3.56 1.3 1.378z"/>
                </svg>
                Behance
              </a>
              <a href="mailto:Elipinkboy@gmail.com" className="contact-link">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                Elipinkboy@gmail.com
              </a>
              <span className="contact-link">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Cali, Colombia
              </span>
            </div>
          </div>
        </AnimatedContent>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <span>Designed & built by Andrea Cubillos Llamosa</span>
          <span className="footer-year">2026</span>
        </div>
      </footer>
    </section>
  );
}
