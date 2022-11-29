const fontFamilyToken =
  'var(--font-titillium-web), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

export const tableTheme = {
  components: {
    Table: {
      colorSplit: '#0050B3',
    },
    Modal: {
      colorBgBase: 'white',
      colorTextBase: 'black',
    },
  },
  token: {
    fontFamily: fontFamilyToken,
    colorBgBase: '#002766',
    colorTextBase: 'white',
  },
};

export const modalTheme = {
  token: {
    fontFamily: fontFamilyToken,
    colorBgBase: '#002766',
    colorTextBase: 'white',
  },
};
