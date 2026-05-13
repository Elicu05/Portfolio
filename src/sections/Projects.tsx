import { useState } from 'react';
import SpotlightCard from '../components/SpotlightCard/SpotlightCard';

import imgHema from '../assets/Hema UI UX.png';
import imgBuddyUp from '../assets/Buddy Up UI UX.png';
import imgMoodj from '../assets/Moodj UI.png';
import imgTiti from '../assets/Titi UI UX.png';
import imgClip from '../assets/Clip UI UX Case Study.png';
import imgKooli from '../assets/Kooli UI UX Case Study.png';
import imgBoosting from '../assets/Boosting motivation UX Case Study.png';
import imgVibraVe from '../assets/Vibra Vé UX Case Study.png';
import imgCtrlX from '../assets/CTRL-X Magazine Brand.png';
import imgAlpin from '../assets/Alpin Rebrand.png';
import imgNova from '../assets/NOVA Branding.png';

/** Hex accents for spotlight tint (spotlight uses 8-digit hex alpha in JSX). */
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
] as const;

type FilterId = 'all' | 'uiux' | 'caseStudy' | 'branding';

const FILTER_TABS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All projects' },
  { id: 'uiux', label: 'UI/UX Design' },
  { id: 'caseStudy', label: 'UX Case Study' },
  { id: 'branding', label: 'Branding/Graphic Design' },
];

interface ProjectDef {
  id: string;
  title: string;
  image: string;
  link: string;
}

const PROJECTS: ProjectDef[] = [
  {
    id: 'hema',
    title: 'HEMA',
    image: imgHema,
    link: 'https://www.behance.net/gallery/248468629/hema-UI-UX-Case-Study',
  },
  {
    id: 'buddy-up',
    title: 'Buddy Up',
    image: imgBuddyUp,
    link: 'https://www.behance.net/gallery/207274865/BUDDYUP-UI-UX',
  },
  {
    id: 'moodj',
    title: 'Moodj',
    image: imgMoodj,
    link: 'https://www.behance.net/gallery/236562013/Moodj-UIFront-end',
  },
  {
    id: 'titi',
    title: 'Titi',
    image: imgTiti,
    link: 'https://www.behance.net/gallery/234180851/Titi-UIFront-end',
  },
  {
    id: 'clip',
    title: 'Clip',
    image: imgClip,
    link: 'https://www.behance.net/gallery/239336329/Clip-UI-UX-Case-Study',
  },
  {
    id: 'kooli',
    title: 'Kooli',
    image: imgKooli,
    link: 'https://www.behance.net/gallery/239461841/Kooli-UI-UX-Research',
  },
  {
    id: 'boosting',
    title: 'Boosting motivation',
    image: imgBoosting,
    link: 'https://www.behance.net/gallery/234033367/UX-Case-Study-Boosting-Exercise-Motivation',
  },
  {
    id: 'vibra-ve',
    title: 'Vibra Ve',
    image: imgVibraVe,
    link: 'https://www.behance.net/gallery/234835725/Vibra-v',
  },
  {
    id: 'ctrl-x',
    title: 'CTRL-X',
    image: imgCtrlX,
    link: 'https://www.behance.net/gallery/213616245/CTRL-X-Magazine',
  },
  {
    id: 'alpin',
    title: 'Alpin',
    image: imgAlpin,
    link: 'https://www.behance.net/gallery/206654855/Alpin-Rebranding-guide',
  },
  {
    id: 'nova',
    title: 'Nova',
    image: imgNova,
    link: '',
  },
];

const ORDER_BY_FILTER: Record<FilterId, readonly string[]> = {
  all: [
    'hema',
    'buddy-up',
    'moodj',
    'titi',
    'clip',
    'kooli',
    'boosting',
    'vibra-ve',
    'ctrl-x',
    'alpin',
    'nova',
  ],
  uiux: ['hema', 'buddy-up', 'titi', 'moodj', 'clip', 'kooli'],
  caseStudy: ['boosting', 'vibra-ve', 'clip', 'kooli'],
  branding: ['ctrl-x', 'alpin', 'nova'],
};

const accentById: Record<string, string> = {};
ORDER_BY_FILTER.all.forEach((id, index) => {
  accentById[id] = ACCENTS[index % ACCENTS.length];
});

function projectsForFilter(filter: FilterId): ProjectDef[] {
  const byId = new Map(PROJECTS.map(p => [p.id, p]));
  return ORDER_BY_FILTER[filter].map(id => byId.get(id)).filter((p): p is ProjectDef => p != null);
}

export default function Projects() {
  const [filter, setFilter] = useState<FilterId>('all');
  const visible = projectsForFilter(filter);

  return (
    <section className="projects-section" id="projects">
      <div className="section-container">
        <div className="project-categories" role="tablist" aria-label="Filter projects by category">
          {FILTER_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              className={`category-pill ${filter === id ? 'active' : ''}`}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {visible.map(project => {
            const openOnClick = project.link.trim().length > 0;
            const card = (
              <SpotlightCard className="project-card" spotlightColor={`${accentById[project.id]}40`}>
                <div
                  className="project-card-bg"
                  style={{ backgroundImage: `url(${project.image})` }}
                  role="img"
                  aria-label={project.title}
                />
                <div className="project-card-inner">
                  <h3 className="project-title">{project.title}</h3>
                  <div className="project-footer">
                    <span className="project-link" style={{ color: accentById[project.id] }}>
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
            );

            if (!openOnClick) return <div key={project.id}>{card}</div>;

            return (
              <a
                key={project.id}
                className="project-card-anchor"
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} on Behance`}
              >
                {card}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
