// 3D colors per theme (three.js needs real values, not CSS variables).
// Keep keys in sync with the [data-theme] blocks in themes.css.
export const themes = {
  'modern-minimal': {
    // hero: project card carousel
    carousel: {
      fog: '#07070D',
      ribbon: { bandA: '#1E1D46', bandB: '#3B2C78', text: '#E9EDFF' },
    },
    // loader: solid letters filling with a smooth gradient
    loader: {
      empty: '#1D1C33',                                       // unfilled letter
      fill: ['#3F50D8', '#6A4FD8', '#9A86F0', '#DCDDFB'],     // bottom → top
      surface: '#FFFFFF',                                     // bright line at the fill level
    },
  },
};

export const DEFAULT_THEME = 'modern-minimal';

export function currentTheme() {
  const key = document.documentElement.dataset.theme || DEFAULT_THEME;
  return themes[key] || themes[DEFAULT_THEME];
}
