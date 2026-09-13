import Reveal from './Reveal';
import Scramble from './Scramble';
import { useActiveSection } from './ActiveSection';

export default function Section({ id, rail, title, children }) {
  const active = useActiveSection();

  return (
    <section className="section" id={id} aria-labelledby={`${id}-title`}>
      <Reveal className={`section__rail ${active === id ? 'is-active' : ''}`} aria-hidden="true">
        {rail}
      </Reveal>
      <div>
        {/* once: the heading carries the phosphor flicker, and replaying that
            every time you pass the section reads as the text glitching grey */}
        <Reveal as="h2" className="section__title" delay={60} id={`${id}-title`} once>
          <Scramble text={title} />
        </Reveal>
        {children}
      </div>
    </section>
  );
}
