import { Suspense, lazy, useEffect, useState } from 'react';
import Icon from '../components/Icon';
import { profile } from '../data/profile';

// ogl is only ~30 kB, but there is no reason to ship it to phones that
// will never run the shader, so it loads in its own chunk.
const FaultyTerminal = lazy(() => import('../components/FaultyTerminal'));

function canRunShader() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (window.matchMedia('(max-width: 720px)').matches) return false;
  // pointer: fine keeps it off phones and tablets entirely, including landscape
  // where the width check alone would let it through and the pattern would be
  // squashed into a letterbox. It is also the only place the mouse reaction
  // means anything.
  if (!window.matchMedia('(pointer: fine)').matches) return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Hero() {
  const [shader, setShader] = useState(false);

  useEffect(() => {
    setShader(canRunShader());
  }, []);

  return (
    <header className="hero" id="top">
      {shader ? (
        <Suspense fallback={<div className="hero__bg hero__bg--static" />}>
          <div className="hero__bg">
            <FaultyTerminal
              scale={1.6}
              gridMul={[2, 1]}
              digitSize={1.3}
              timeScale={0.4}
              scanlineIntensity={0.55}
              glitchAmount={0.9}
              flickerAmount={0.6}
              noiseAmp={0.9}
              chromaticAberration={0}
              curvature={0.12}
              tint="#ffa53c"
              mouseReact
              mouseStrength={0.35}
              pageLoadAnimation
              brightness={0.5}
            />
          </div>
        </Suspense>
      ) : (
        <div className="hero__bg hero__bg--static" />
      )}

      <div className="hero__veil" aria-hidden="true" />

      <div className="shell hero__inner">
        <h1 className="hero__name">
          <span>Šimon</span>
          <span>Mariaš</span>
        </h1>
        <p className="hero__role">
          <span className="shine">{profile.role}</span>
          <span className="caret" aria-hidden="true" />
        </p>
        <p className="hero__blurb">
          Second-year student at Skyro. I make games in Unity, mostly the programming side of them,
          and put what I finish on itch.io.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#projects">
            <Icon name="down" />
            See projects
          </a>
          <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
            <Icon name="github" />
            GitHub
          </a>
          <a className="btn" href={profile.itch} target="_blank" rel="noreferrer">
            <Icon name="itch" />
            itch.io
          </a>
        </div>

        <a className="hero__scroll" href="#projects">
          <span className="hero__scroll-word">scroll</span>
          <span className="hero__scroll-arrow" aria-hidden="true">
            ↓
          </span>
        </a>
      </div>
    </header>
  );
}
