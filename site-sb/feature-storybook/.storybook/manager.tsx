import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const theme = create({
  base: 'light',
  brandTitle: 'Statstrade Dev - UI Components',
  brandUrl: 'https://www.statstrade.io',
  brandImage: '/logo.png', // Update this path to your logo
  brandTarget: '_self',
  // Customize other theme properties as needed
  colorPrimary: '#3A10E5',
  colorSecondary: '#5856D6',
});

addons.setConfig({
  theme,
});
