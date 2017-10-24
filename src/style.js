const style = {};

style.animationDuration = 0.4;
style.animationDurationLg = 5 * style.animationDuration;

style.fonts = {
  text: 'Open Sans'
};

style.css = {
  animationDuration: `${style.animationDuration}s`,
  animationDurationLg: `${style.animationDurationLg}s`,

  animationEasing: 'cubic-bezier(0.25, 1, 0.25, 1)',
  animationElastic: 'cubic-bezier(0.5, 2, 0.5, 0.5)',

  fontText: style.fonts.text,

  foregroundLight: '#999999',
  foreground: '#404040',
  foregroundDark: '#2c3e50',
  foregroundDarker: '#000000',

  neutralLighter: '#ffffff',
  neutralLight: '#ffffff',
  neutral: '#ecf0f1',
  neutralDark: '#95a5a6',

  primary: '#3498db',
  primaryDark: '#217dbb',

  success: '#2ecc71',
  warning: '#f1c40f',
  danger: '#e74c3c',
  info: '#2980b9',

  h1FontSize: '48px',
  h2FontSize: '30px',
  h3FontSize: '24px',
  h4FontSize: '20px',
  h5FontSize: '16px',
  h6FontSize: '14px'
};

// Export for both Node.js and the browser
(function (exports) {
  Object.keys(style).forEach((key) => exports[key] = style[key]);
}(typeof exports === 'undefined' ? (this.moduleName = {}) : exports));
