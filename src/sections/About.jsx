import Section from '../components/Section';
import Reveal from '../components/Reveal';
import PixelCard from '../components/PixelCard';
import LogoLoop from '../components/LogoLoop';
import { toolLogos, facts } from '../data/profile';
import { SiUnity, SiBlender, SiGit, SiGithub, SiRider, SiItchdotio } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import csharpSvg from '../assets/logos/csharp.svg?raw';
import reaperSvg from '../assets/logos/reaper.svg?raw';

const ICONS = { SiUnity, SiBlender, SiGit, SiGithub, SiRider, SiItchdotio, VscVscode };
const SVGS = { csharp: csharpSvg, reaper: reaperSvg };

const toNode = tool => {
  const Icon = tool.icon ? ICONS[tool.icon] : null;
  return {
    // Brand SVGs are inlined rather than loaded as <img> so their fills can
    // be currentColor and they dim and light up exactly like the icons. The
    // files are pre-recoloured; knocked-out detail uses var(--bg).
    node: Icon ? (
      <Icon />
    ) : (
      <span className="toolloop__logo" dangerouslySetInnerHTML={{ __html: SVGS[tool.svg] }} />
    ),
    title: tool.title,
    href: tool.href,
    ariaLabel: tool.title
  };
};

const logos = toolLogos.map(toNode);

export default function About() {
  return (
    <>
      <Section id="about" rail="~/about" title="Who is writing this code">
        <div className="about">
          <Reveal className="about__side">
            <PixelCard variant="amber" className="photo-card">
              {/* swap public/images/photo.webp for the real portrait, 4:5,
                  around 600px wide. Nothing else needs changing. */}
              <img className="about__photo" src="images/photo.webp" alt="Šimon Mariaš" />
            </PixelCard>
          </Reveal>

          <Reveal className="about__text" delay={110}>
            <p className="about__lead">
              I am a second-year student at Skyro, a Slovak secondary school for IT and AI, based in
              Bratislava. I'm studying game development, primarily Unity and C#.
            </p>
            <p>
              I was always fascinated by computers and programming in general, which is how I found my
              way to Skyro. I also enjoy amateur astronomy, tech and coding.
            </p>
            <p>
              I'm also studying 3D and sound design, so I work with Blender and Reaper at school, but
              coding is the one thing I also do on my own.
            </p>
          </Reveal>

          <Reveal as="dl" className="facts" delay={180}>
            {facts.map(fact => (
              <div className="facts__row" key={fact.key}>
                <dt className="facts__key">{fact.key}</dt>
                <dd className="facts__val">{fact.value}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section id="skills" rail="~/skills" title="Tools I work with">
        <Reveal className="toolloop" delay={120}>
          <LogoLoop
            logos={logos}
            speed={42}
            direction="left"
            logoHeight={56}
            gap={80}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="#12100d"
            ariaLabel="Tools and technologies I use"
          />
        </Reveal>
      </Section>
    </>
  );
}
