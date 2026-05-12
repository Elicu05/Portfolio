import AnimatedContent from '../components/AnimatedContent/AnimatedContent';
import SpotlightCard from '../components/SpotlightCard/SpotlightCard';

interface Project {
  title: string;
  description: string;
  category: string;
  accent: string;
  icon: string;
}

const projects: Project[] = [
  {
    title: 'E-commerce & Landing Page Optimization',
    description: 'Auditing and redesigning flows to improve conversion alignment and user journeys through scalable component systems.',
    category: 'UI/UX Design',
    accent: 'var(--blue-500)',
    icon: '◈'
  },
  {
    title: 'ICESI Immersive VR Experience',
    description: 'A comprehensive user flow and interface design for a virtual reality experience tailored for the ICESI campus.',
    category: 'UI/UX Design',
    accent: 'var(--blue-600)',
    icon: '◎'
  },
  {
    title: 'Meta Advertising Visuals',
    description: 'Strategic configuration of digital assets and tracking for high-performing lead generation campaigns.',
    category: 'UI/UX Design',
    accent: 'var(--blue-400)',
    icon: '⬡'
  },
  {
    title: 'Urban Mobility Analysis (MIO Cali)',
    description: 'A deep-dive research report using the "Iceberg Model" to analyze mobility issues and social exclusion in Cali, Colombia.',
    category: 'UX Case Study',
    accent: '#6366f1',
    icon: '◉'
  },
  {
    title: 'Caregiver & Elderly Autonomy',
    description: 'Exploring physical activity, nutrition, and sleep hygiene for the elderly through detailed persona-based case studies.',
    category: 'UX Case Study',
    accent: '#8b5cf6',
    icon: '❖'
  },
  {
    title: 'Academic Data Centralization Platform',
    description: 'End-to-end prototype integrating student reports and early warning systems into a single, accessible platform.',
    category: 'UX Case Study',
    accent: '#a78bfa',
    icon: '◆'
  },
  {
    title: 'Le Alarm',
    description: 'Technical product pitch and branding for a gesture-controlled humidifier alarm clock system.',
    category: 'Branding',
    accent: '#ec4899',
    icon: '✦'
  },
  {
    title: 'Japanese Kawaii Retro-Futurism',
    description: 'Aesthetic explorations and high-fidelity 3D visual generation focusing on "Kawaii Cyberpunk" themes.',
    category: 'Branding',
    accent: '#f472b6',
    icon: '✧'
  },
  {
    title: 'Visual Identity Systems',
    description: 'Standardization of brand advertising formats and digital assets to maintain visual consistency across marketing campaigns.',
    category: 'Branding',
    accent: '#fb7185',
    icon: '◇'
  }
];

export default function Projects() {
  return (
    <section className="projects-section" id="projects">
      <div className="section-container">
        


        <div className="projects-grid">
          {projects.map((project, i) => (
            <AnimatedContent key={i} distance={60} duration={0.8} delay={i * 0.08}>
              <SpotlightCard
                className="project-card"
                spotlightColor={`${project.accent}22`}
              >
                <div className="project-card-inner">
                  <div className="project-icon" style={{ color: project.accent }}>
                    {project.icon}
                  </div>
                  <span className="project-category" style={{ color: project.accent }}>
                    {project.category}
                  </span>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-footer">
                    <span className="project-link">
                      View Details
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M4 12l8-8M4 4h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
