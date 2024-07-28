export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    account: '/account',
    customers: '/customers',
    ranking: '/ranking',
    gameroom: '/game-room',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
