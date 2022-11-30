// eslint-disable-next-line import/no-extraneous-dependencies
import { fontFamily } from 'tailwindcss/defaultTheme';

const commonAntdTheme = {
  token: {
    fontFamily: ['var(--font-titillium-web)', ...fontFamily.sans].join(' '),
  },
};

export default commonAntdTheme;
