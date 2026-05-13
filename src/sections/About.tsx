import { useRef, type RefObject } from 'react';
import AnimatedContent from '../components/AnimatedContent/AnimatedContent';
import Lanyard from '../components/Lanyard/Lanyard';

import figmaIcon from '../assets/Figma.png';
import photoshopIcon from '../assets/Photoshop.png';
import illustratorIcon from '../assets/Illustrator.png';
import visualIcon from '../assets/Visual.png';

const skills = [
  { col1: 'UI / UX Design', col2: 'App Design' },
  { col1: 'UX Research', col2: 'Design Systems' },
  { col1: 'Product Design', col2: 'E-commerce Strategy' },
];

const softwares = [
  { name: 'Figma', icon: figmaIcon },
  { name: 'Photoshop', icon: photoshopIcon },
  { name: 'Illustrator', icon: illustratorIcon },
  { name: 'Visual', icon: visualIcon },
];

/** Camera & placement for the About lanyard — edit values here. */
const ABOUT_LANYARD_CAMERA = {
  /**
   * Perspective camera [x, y, z] in scene units. Shifts what you see (left/right/up/down + distance).
   * With fov 20, try steps of ~0.5–2 for visible X/Y pan; z is also scaled by subjectZoom.
   */
  position: [0, 0, 28] as [number, number, number],
  /** Larger = badge fills more of the overlay (~1.2–2). */
  subjectZoom: 1.55,
  /**
   * Moves rope + badge + strap together in world space — most obvious control for sliding the card on screen.
   * +x → right, +y → up (Three.js coords).
   */
  rigPosition: [-4.9, 0.5, 0] as [number, number, number],
};

export default function About() {
  const aboutGridRef = useRef<HTMLDivElement>(null);

  return (
    <section className="about-section" id="about">
      {/* Resume grid (~25/40/35): spacing in App.css · lanyard: ABOUT_LANYARD_CAMERA */}
      <div className="about-grid" ref={aboutGridRef}>
        {/* Left column — Lanyard card */}
        <div className="about-col-lanyard">
          <div className="lanyard-layout-spacer" aria-hidden />

          <AnimatedContent className="about-contact-slot" distance={40} duration={0.8} delay={0.4}>
            <div className="about-contact">
              <div className="contact-line">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue-600)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>Elipinkboy@gmail.com</span>
              </div>
              <div className="contact-line">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue-600)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
                </svg>
                <a href="https://behance.net/elicubillos" target="_blank" rel="noopener noreferrer">
                  behance.net/elicubillos
                </a>
              </div>
              <div className="contact-line">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue-600)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Cali, Colombia</span>
              </div>
            </div>
          </AnimatedContent>
        </div>

        {/* Center column — Title, bio, experience */}
        <div className="about-col-center">
          <AnimatedContent distance={40} duration={0.8} delay={0.1}>
            <h2 className="about-title">About me</h2>
          </AnimatedContent>

          <AnimatedContent distance={40} duration={0.8} delay={0.15}>
            <div className="about-bio">
              <p>
                Hi, I'm <strong>Eli Cubillos Llamosa</strong> a Mid UI/UX Designer
                with a deep passion for human-centered digital experiences.
              </p>
              <p>
                Through my professional journey and academic research, I've explored various areas such as
                <strong> UX Research</strong>, <strong>Design Systems</strong>, and <strong>E-commerce
                architecture</strong>, which allow me to understand digital products from multiple perspectives.
              </p>
              <p>
                I aim to create designs that are not only functional but also
                meaningful solutions that simplify complex workflows and drive positive user behavior. I'm constantly staying current with industry trends
              </p>
            </div>
          </AnimatedContent>

          <AnimatedContent className="about-slot-experience" distance={40} duration={0.8} delay={0.25}>
            <h3 className="about-pill-heading">Experience</h3>
            <div className="about-experience">
              <span className="exp-role-title">Mid UI/UX Designer (2022 – Present)</span>
              <ul className="exp-bullets">
                <li>Led end-to-end design of functional prototypes and digital products for industrial clients, centralizing operational data into unified platforms.</li>
                <li>Optimized apps, e-commerce architectures and landing pages, improving conversion rates through high-fidelity redesigns.</li>
                <li>Developed scalable Design Systems and component libraries in Figma to ensure visual consistency.</li>
              </ul>
            </div>
          </AnimatedContent>
        </div>

        {/* Right column — Education, fields, softwares */}
        <div className="about-col-right">
          <AnimatedContent className="about-dots-slot" distance={40} duration={0.8} delay={0.1}>
            <div className="about-dots">
              <span className="about-dot" style={{ background: 'var(--blue-600)' }} />
              <span className="about-dot" style={{ background: 'var(--blue-400)' }} />
              <span className="about-dot" style={{ background: '#7F6BFB' }} />
            </div>
          </AnimatedContent>

          <AnimatedContent distance={40} duration={0.8} delay={0.2}>
            <h3 className="about-pill-heading">Education</h3>
            <div className="about-education">
              <div className="edu-entry">
                <span className="edu-title">Bachelor Degree</span>
                <span className="edu-meta">Universidad Icesi &nbsp;|&nbsp; 2022 – Present</span>
                <span className="edu-detail">Faculty: Design and Engineering</span>
                <span className="edu-detail">Major: Interactive Design / UI·UX</span>
              </div>
              <div className="edu-entry">
                <span className="edu-title">Specialized Training</span>
                <span className="edu-meta">Spcrum · Design Thinking &nbsp;|&nbsp; 2024</span>
                <span className="edu-detail">UX methodology workshops &amp; Digital marketing configuration</span>
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent className="about-slot-right-spaced" distance={40} duration={0.8} delay={0.3}>
            <h3 className="about-pill-heading">Creative fields</h3>
            <div className="about-fields">
              {skills.map((pair, i) => (
                <div className="fields-row" key={i}>
                  <span className="field-item">
                    <span className="about-list-mark" aria-hidden>
                      ✦
                    </span>{' '}
                    {pair.col1}
                  </span>
                  <span className="field-item">
                    <span className="about-list-mark" aria-hidden>
                      ✦
                    </span>{' '}
                    {pair.col2}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedContent>

          <AnimatedContent className="about-slot-right-spaced" distance={40} duration={0.8} delay={0.35}>
            <div className="softwares-card">
              <h3 className="about-pill-heading">Softwares</h3>
              <div className="software-badges">
                {softwares.map((sw) => (
                  <span className="sw-badge" key={sw.name} title={sw.name}>
                    <img className="sw-icon" src={sw.icon} alt={sw.name} loading="lazy" />
                  </span>
                ))}
              </div>
            </div>
          </AnimatedContent>
        </div>

        {/* Full-grid WebGL overlay — rope + badge can drift over neighbouring columns */}
        <div className="about-lanyard-overlay">
          <Lanyard
            position={ABOUT_LANYARD_CAMERA.position}
            subjectZoom={ABOUT_LANYARD_CAMERA.subjectZoom}
            rigPosition={ABOUT_LANYARD_CAMERA.rigPosition}
            eventSource={aboutGridRef as RefObject<HTMLElement>}
          />
        </div>
      </div>
    </section>
  );
}
