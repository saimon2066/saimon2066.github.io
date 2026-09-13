// Edit this file to add or change projects. Nothing else needs touching.
// `shots` drives the gallery: the first one is shown large, the rest become
// thumbnails. Put the files in /public/images/.
export const projects = [
  {
    name: 'CAT-MAN',
    kind: 'School project, team of 3',
    year: '2026',
    summary:
      'CAT-MAN is a PAC-MAN remake made with Unity that we created in 3 months, presented as our first-year project.',
    shots: [
      { src: 'images/catman-1.webp', alt: 'CAT-MAN title screen with pixel-art fish and enemies' },
      { src: 'images/catman-2.webp', alt: 'CAT-MAN gameplay: the cat collecting pellets in a green maze' },
      { src: 'images/catman-3.webp', alt: 'CAT-MAN gameplay with dog enemies closing in on the cat' }
    ],
    points: [
      'I was the main programmer of a three-person team. I was also responsible for the whole Unity implementation.',
      'I built the enemy AI, level state, and everything from the original arcade game.',
      'We published our project and presented it in June 2026.'
    ],
    tags: ['Unity', 'C#', 'Team of 3'],
    links: [
      { label: 'Play it on itch.io', href: 'https://saimon2066.itch.io/cat-man', icon: 'itch', primary: true },
      { label: 'Source', href: 'https://github.com/saimon2066/CAT-MAN', icon: 'github' }
    ]
  },
  {
    name: 'Procedural Planets',
    kind: 'Personal project',
    year: 'In progress',
    summary: 'A work-in-progress system that generates planets with level of detail on the GPU.',
    shots: [
      { src: 'images/planets-1.webp', alt: 'A procedurally generated planet rendered as a rough sphere' },
      { src: 'images/planets-2.webp', alt: 'Close-up of the generated terrain surface' },
      { src: 'images/planets-3.webp', alt: 'Wireframe view showing the triangle density of the terrain mesh' }
    ],
    points: [
      'Mesh generation is handled by the GPU using compute shaders, which moves the hardest work from the CPU.',
      "It started with only a basic CPU version which didn't perform well, so I'm now rewriting it with the GPU in mind. That is where I learned how to use compute shaders."
    ],
    tags: ['Unity', 'C#', 'Compute shaders'],
    links: [{ label: 'Source', href: 'https://github.com/saimon2066/Procedural-Planets', icon: 'github' }]
  },
  {
    name: 'OOP Project',
    kind: 'Individual assignment',
    year: '2026',
    summary:
      "It's a small learning project, not a full game, which helped me learn object-oriented programming in C# and Unity.",
    shots: [
      { src: 'images/oop-1.webp', alt: 'Gameplay with projectiles, enemies and damage numbers' },
      { src: 'images/oop-2.webp', alt: 'Fireball on cooldown while enemies close in' },
      { src: 'images/oop-3.webp', alt: 'Both abilities on cooldown near the end of a run' }
    ],
    points: [
      'Every character and ability is written with OOP in mind, using abstract classes and interfaces.',
      'This was never meant to be a full game, only the basic structure. There are no menus, no progression, and no art.',
      'I was given this project separately from the rest of the class because I was ahead in Unity.'
    ],
    tags: ['Unity', 'C#', 'OOP'],
    links: [{ label: 'Source', href: 'https://github.com/saimon2066/OOP-Project', icon: 'github' }]
  }
];
