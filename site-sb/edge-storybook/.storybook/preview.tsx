import { Preview } from '@storybook/react-vite';
import { View } from 'react-native';

import { StorybookDecorator } from './decorator'

// Import global styles if you have any
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // Add viewport settings for responsive testing
    viewport: {
      options: {
        mobile1: {
          name: 'Small mobile',
          styles: {
            width: '320px',
            height: '568px',
          },
        },
        mobile2: {
          name: 'Large mobile',
          styles: {
            width: '414px',
            height: '896px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
      },
    },
    options: {
      storySort: {
        order: ['Introduction', 'Components', 'Layout', 'Pages'],
      },
    },
    backgrounds: {
      options: {
        light: { name: 'light', value: '#ffffff' },
        dark: { name: 'dark', value: '#1a1a1a' }
      }
    },
  },

  decorators: [
    StorybookDecorator,
  ],

  globalTypes: {
    theme1: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { icon: 'sun', value: 'light', title: 'Light' },
          { icon: 'moon', value: 'dark', title: 'Dark' },
        ],
      },
    },
    theme2: {
      name: 'Theme',
      description: 'Theme for your components',
      defaultValue: null,
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: null, title: 'None' },
        ],
      },
    },
    theme3: {
      name: 'Theme',
      description: 'Theme for your components',
      defaultValue: null,
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: null, title: 'None' },
        ],
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'light'
    }
  }
};

export default preview;
