const Constants = {
  appOwnership: 'standalone',
  deviceName: 'Storybook Web',
  expoVersion: '0.0.0',
  installationId: 'storybook-installation-id',
  isDevice: false,
  platform: { web: { userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '' } },
  sessionId: 'storybook-session-id',
  statusBarHeight: 0,
  manifest: undefined,
  manifest2: undefined,
} as const

export default Constants
