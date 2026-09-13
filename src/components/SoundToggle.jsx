import { useEffect, useState } from 'react';
import { isEnabled, setEnabled, subscribe, play } from '../lib/sound';

export default function SoundToggle() {
  const [on, setOn] = useState(false);

  // read after mount so the markup is the same on every render path
  useEffect(() => {
    setOn(isEnabled());
    return subscribe(setOn);
  }, []);

  const toggle = () => {
    if (on) play('toggleOff');
    setEnabled(!on);
  };

  return (
    <button
      type="button"
      className={`sound ${on ? 'is-on' : ''}`}
      onClick={toggle}
      aria-pressed={on}
      title={on ? 'Interface sounds on' : 'Interface sounds off'}
    >
      <span className="sound__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="sr-only">{on ? 'Turn interface sounds off' : 'Turn interface sounds on'}</span>
    </button>
  );
}
