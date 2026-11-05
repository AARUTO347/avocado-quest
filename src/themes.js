import bgMagma from './assets/themes/bg-magma.png';
import bgMushroom from './assets/themes/bg-mushroom.png';
import bgMoss from './assets/themes/bg-moss.jpg';
import bgMangrove from './assets/themes/bg-mangrove.jpg';
import bgMoonlight from './assets/themes/bg-moonlight.jpg';
import bgSunset from './assets/themes/bg-sunset.jpg';

// Palettes derived from the user's "SK CONTEST" reference board.
// vars map to the CSS custom properties in styles.css (:root).
export const THEMES = [
  {
    id: 'meadow', name: 'MEADOW', bg: null,
    swatch: ['#7dbb57', '#b07a45', '#fff8e7'],
    vars: null // default :root palette
  },
  {
    id: 'sunset', name: 'SUNSET', bg: bgSunset,
    swatch: ['#3a2430', '#ffd9a0', '#d98a4f'],
    vars: {
      '--grass': '#3a2430', '--cream': '#fbeee0', '--wood': '#a05a3c',
      '--wood-dark': '#5e2f22', '--ink': '#402028', '--leaf': '#d98a4f',
      '--blush': '#f2a0b4', '--gold': '#ffd9a0'
    }
  },
  {
    id: 'moss', name: 'MOSS', bg: bgMoss,
    swatch: ['#12300f', '#8fd94f', '#eef3d9'],
    vars: {
      '--grass': '#12300f', '--cream': '#eef3d9', '--wood': '#4f7a3a',
      '--wood-dark': '#274a1e', '--ink': '#1e3318', '--leaf': '#6cb83e',
      '--blush': '#a8d98a', '--gold': '#d9f470'
    }
  },
  {
    id: 'mangrove', name: 'MANGROVE', bg: bgMangrove,
    swatch: ['#10222e', '#57b8a2', '#e9f2f0'],
    vars: {
      '--grass': '#10222e', '--cream': '#e9f2f0', '--wood': '#3f6b6b',
      '--wood-dark': '#1d3a3c', '--ink': '#16303a', '--leaf': '#57b8a2',
      '--blush': '#7fb0d9', '--gold': '#cfe98a'
    }
  },
  {
    id: 'mushroom', name: 'MUSHROOM', bg: bgMushroom,
    swatch: ['#141233', '#4fc3d9', '#e8ecf7'],
    vars: {
      '--grass': '#141233', '--cream': '#e8ecf7', '--wood': '#5a5f9e',
      '--wood-dark': '#2b2d5e', '--ink': '#232448', '--leaf': '#4fc3d9',
      '--blush': '#9d8cff', '--gold': '#a8e6ff'
    }
  },
  {
    id: 'magma', name: 'MAGMA', bg: bgMagma,
    swatch: ['#2b0d12', '#d95b29', '#f3dfc2'],
    vars: {
      '--grass': '#2b0d12', '--cream': '#f3dfc2', '--wood': '#8a4a2b',
      '--wood-dark': '#4a1f16', '--ink': '#3a1420', '--leaf': '#d95b29',
      '--blush': '#ff8a5c', '--gold': '#ffd75e'
    }
  },
  {
    id: 'moonlight', name: 'MOONLIGHT', bg: bgMoonlight,
    swatch: ['#161428', '#b39ddb', '#efecf7'],
    vars: {
      '--grass': '#161428', '--cream': '#efecf7', '--wood': '#6b5a8a',
      '--wood-dark': '#352c4e', '--ink': '#2a2440', '--leaf': '#9d8cff',
      '--blush': '#c9a0ff', '--gold': '#e8d5f2'
    }
  }
];

export function themeById(id) {
  return THEMES.find(t => t.id === id) || THEMES[0];
}
