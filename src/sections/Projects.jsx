import { useEffect } from 'react';
import Section from '../components/Section';
import Reveal from '../components/Reveal';
import Gallery from '../components/Gallery';
import Icon from '../components/Icon';
import { projects } from '../data/projects';

// Slow vertical drift as the project blocks cross the viewport. The whole
// framed card moves, not the image inside it: shifting the image would mean
// scaling it up to hide the edges, which crops the screenshot.
// One rAF-throttled scroll listener, and only cards on screen are touched.
function useParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      for (const shot of document.querySelectorAll('[data-parallax]')) {
        const rect = shot.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > viewport + 100) continue;
        const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        shot.style.transform = `translate3d(0, ${(-progress * 16).toFixed(1)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}

export default function Projects() {
  useParallax();

  return (
    <Section id="projects" rail="~/projects" title="Things I have built">
      <div className="projects">
        {projects.map((project, index) => (
          <article className="project" key={project.name}>
            <Reveal className="project__header">
              <span className="project__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="project__name">{project.name}</h3>
                <span className="project__meta">
                  {project.kind}, {project.year}
                </span>
              </div>
            </Reveal>

            <Reveal className="project__media" delay={80}>
              <div data-parallax>
                <Gallery shots={project.shots} name={project.name} />
              </div>
            </Reveal>

            <Reveal className="project__body" delay={160}>
              <p className="project__summary">{project.summary}</p>

              <ul className="project__points">
                {project.points.map(point => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              <div className="project__tags">
                {project.tags.map(tag => (
                  <span className="project__tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>

              {project.links.length > 0 && (
                <div className="project__links">
                  {project.links.map(link => (
                    <a
                      className={`btn ${link.primary ? 'btn--primary' : ''}`}
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon name={link.icon} />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </Reveal>
          </article>
        ))}
      </div>
    </Section>
  );
}
