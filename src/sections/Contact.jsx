import Section from '../components/Section';
import Reveal from '../components/Reveal';
import Icon from '../components/Icon';
import { profile } from '../data/profile';

export default function Contact() {
  return (
    <Section id="contact" rail="~/contact" title="Get in touch">
      <Reveal as="p" delay={60}>
        Open to internships, junior Unity work, and game jams. Email is the fastest way to reach me.
      </Reveal>
      <Reveal as="ul" className="contact__list" delay={120}>
        <li className="contact__row">
          <span className="contact__key">Email</span>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </li>
        <li className="contact__row">
          <span className="contact__key">GitHub</span>
          <a href={profile.github} target="_blank" rel="noreferrer">
            github.com/{profile.handle} <Icon name="github" />
          </a>
        </li>
        <li className="contact__row">
          <span className="contact__key">itch.io</span>
          <a href={profile.itch} target="_blank" rel="noreferrer">
            {profile.handle}.itch.io <Icon name="itch" />
          </a>
        </li>
      </Reveal>
    </Section>
  );
}
