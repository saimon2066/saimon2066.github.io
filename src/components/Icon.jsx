// Small glyphs for buttons. Brand marks come from react-icons, which is
// already a dependency; the arrows are inline because they are four lines.
import { SiGithub, SiItchdotio } from 'react-icons/si';

const COMPONENTS = {
  github: SiGithub,
  itch: SiItchdotio
};

const PATHS = {
  external: (
    <>
      <path d="M6 3h7v7" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13 3 6.5 9.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 12.5H3.5V5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  down: <path d="M8 12.5 3 6.5h10z" />
};

export default function Icon({ name }) {
  const Brand = COMPONENTS[name];
  if (Brand) return <Brand className="icon" aria-hidden="true" />;

  const shape = PATHS[name];
  if (!shape) return null;

  return (
    <svg className="icon" viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      {shape}
    </svg>
  );
}
