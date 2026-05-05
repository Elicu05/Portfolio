import AnimatedContent from '../components/AnimatedContent/AnimatedContent';
import ScrollFloat from '../components/ScrollFloat/ScrollFloat';

const experiences = [
  {
    title: 'Mid UI/UX Designer',
    period: '2021 – Present',
    highlights: [
      'Led end-to-end design of functional prototypes for industrial clients, centralizing scattered operational data into unified platforms',
      'Optimized e-commerce architectures and landing pages, improving conversion rates through high-fidelity redesigns',
      'Developed scalable Design Systems and component libraries in Figma to ensure visual consistency',
      'Collaborated with cross-functional teams using HTML, CSS, and JS knowledge for pixel-perfect implementation'
    ]
  }
];

const training = [
  {
    title: 'Meta Pixel Implementation & Digital Marketing',
    description: 'Advanced configuration for lead generation and audience segmentation'
  },
  {
    title: 'Design Thinking & UX Methodologies',
    description: 'Specialized workshops in user research and research-driven decision-making'
  }
];

const tools = [
  { name: 'Figma', icon: '◆' },
  { name: 'FigJam', icon: '◇' },
  { name: 'Adobe Suite', icon: '▲' },
  { name: 'Notion', icon: '■' },
  { name: 'Maze', icon: '●' },
  { name: 'VS Code', icon: '⟨⟩' }
];

export default function Experience() {
  return (
    <section className="experience-section" id="work">
      <div className="section-container">
        <ScrollFloat containerClassName="section-title-wrap" textClassName="section-title">
          Experience
        </ScrollFloat>

        <div className="experience-content">
          {experiences.map((exp, i) => (
            <AnimatedContent key={i} distance={50} duration={0.9} delay={0.1}>
              <div className="exp-card">
                <div className="exp-header">
                  <h3 className="exp-title">{exp.title}</h3>
                  <span className="exp-period">{exp.period}</span>
                </div>
                <ul className="exp-highlights">
                  {exp.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              </div>
            </AnimatedContent>
          ))}

          <AnimatedContent distance={50} duration={0.9} delay={0.2}>
            <div className="training-section">
              <h3 className="subsection-title">Specialized Training</h3>
              <div className="training-grid">
                {training.map((t, i) => (
                  <div className="training-card" key={i}>
                    <h4>{t.title}</h4>
                    <p>{t.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={50} duration={0.9} delay={0.3}>
            <div className="tools-section">
              <h3 className="subsection-title">Software & Tools</h3>
              <div className="tools-grid">
                {tools.map((tool, i) => (
                  <div className="tool-item" key={i}>
                    <span className="tool-icon">{tool.icon}</span>
                    <span className="tool-name">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
