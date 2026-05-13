import AnimatedContent from '../components/AnimatedContent/AnimatedContent';
import SpotlightCard from '../components/SpotlightCard/SpotlightCard';

/** Hex accents for spotlight tint and small UI accents (spotlight uses 8-digit hex alpha). */
const ACCENTS = [
  '#3b82f6',
  '#2563eb',
  '#60a5fa',
  '#6366f1',
  '#8b5cf6',
  '#a78bfa',
  '#ec4899',
  '#f472b6',
  '#fb7185',
  '#38bdf8',
  '#818cf8',
];

interface ProjectFromAsset {
  key: string;
  title: string;
  imageUrl: string;
  accent: string;
}

function titleFromAssetPath(path: string): string {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.(png|jpe?g|webp)$/i, '');
}

function buildProjectsFromAssets(): ProjectFromAsset[] {
  const modules = import.meta.glob<string>('../assets/*.{png,jpg,jpeg,webp}', {
    eager: true,
    import: 'default',
  });

  return Object.entries(modules)
    .map(([path, url], index) => ({
      key: path,
      title: titleFromAssetPath(path),
      imageUrl: url,
      accent: ACCENTS[index % ACCENTS.length],
    }))
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
}

const projects = buildProjectsFromAssets();

export default function Projects() {
  return (
    <section className="projects-section" id="projects">
      <div className="section-container">
        <div className="projects-grid">
          {projects.map((project, i) => (
            <AnimatedContent key={project.key} distance={60} duration={0.8} delay={i * 0.08}>
              <SpotlightCard className="project-card" spotlightColor={`${project.accent}40`}>
                <div
                  className="project-card-bg"
                  style={{ backgroundImage: `url(${project.imageUrl})` }}
                  role="img"
                  aria-label={project.title}
                />
                <div className="project-card-inner">
                  <h3 className="project-title">{project.title}</h3>
                  <div className="project-footer">
                    <span className="project-link" style={{ color: project.accent }}>
                      View Details
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M4 12l8-8M4 4h8v8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
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
