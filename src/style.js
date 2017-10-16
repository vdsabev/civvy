const style = {};

style.animationDuration = 0.4;

style.fonts = {
  text: 'PT Sans'
};

style.css = {
  animationDuration: `${style.animationDuration}s`,
  animationEasing: 'cubic-bezier(0.25, 1, 0.25, 1)',
  animationElastic: 'cubic-bezier(0.5, 2, 0.5, 0.5)',

  fontText: style.fonts.text,

  foregroundLight: '#999999',
  foreground: '#666666',
  foregroundDark: '#333333',
  foregroundDarker: '#000000',

  neutralLighter: '#ffffff',
  neutralLight: '#ecf0f1',
  neutral: '#bdc3c7',
  neutralDark: '#95a5a6',

  primary: '#2980b9',
  success: '#2ecc71',
  warning: '#f1c40f',
  danger: '#e74c3c',
  info: '#3498db'
};

// Export for both Node.js and the browser
(function (exports) {
  Object.keys(style).forEach((key) => exports[key] = style[key]);
}(typeof exports === 'undefined' ? (this.moduleName = {}) : exports));
