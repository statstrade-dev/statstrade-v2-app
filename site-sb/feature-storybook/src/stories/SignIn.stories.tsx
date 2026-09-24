import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SignInScreen } from '@statstrade/feature/auth/sign-in';
import { TamaguiProvider, createTamagui } from '@tamagui/core';
import { config } from '@tamagui/config/v3';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const tamaguiConfig = createTamagui(config);
const queryClient = new QueryClient();

const meta: Meta<typeof SignInScreen> = {
  title: 'Feature/Auth/SignInScreen',
  component: SignInScreen,
  decorators: [
    (Story) => (
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      </TamaguiProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SignInScreen>;

export const Default: Story = {};
