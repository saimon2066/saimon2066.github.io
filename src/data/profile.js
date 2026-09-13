export const profile = {
  first: 'Šimon',
  last: 'Mariaš',
  handle: 'saimon2066',
  role: 'Unity game developer',
  location: 'Slovakia',
  email: 'simonmarias.dev@gmail.com',
  github: 'https://github.com/saimon2066',
  itch: 'https://saimon2066.itch.io'
};

// The key/value block next to the portrait in the about section.
export const facts = [
  { key: 'Based in', value: profile.location },
  { key: 'School', value: 'Skyro, second year' },
  { key: 'Focus', value: 'Unity, C#' },
  { key: 'Languages', value: 'Slovak, English (B2)' }
];

// Shown in the marquee. `icon` is a react-icons export name resolved in
// About.jsx; `svg` names a recoloured brand SVG in src/assets/logos/, used
// for tools that have no icon in any icon set.
export const toolLogos = [
  { icon: 'SiUnity', title: 'Unity', href: 'https://unity.com' },
  { svg: 'csharp', title: 'C#', href: 'https://learn.microsoft.com/dotnet/csharp/' },
  { icon: 'VscVscode', title: 'VS Code', href: 'https://code.visualstudio.com' },
  { icon: 'SiRider', title: 'JetBrains Rider', href: 'https://www.jetbrains.com/rider/' },
  { icon: 'SiGit', title: 'Git', href: 'https://git-scm.com' },
  { icon: 'SiGithub', title: 'GitHub', href: 'https://github.com' },
  { icon: 'SiBlender', title: 'Blender', href: 'https://www.blender.org' },
  { svg: 'reaper', title: 'Reaper', href: 'https://www.reaper.fm' },
  { icon: 'SiItchdotio', title: 'itch.io', href: 'https://itch.io' }
];
