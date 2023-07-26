import { Box, Text, styled } from '@ignite-ui/react'

export const ContentBox = styled(Box, {
  marginTop: '$6',
  display: 'flex',
  flexDirection: 'column',
})

export const ConnectItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  border: '1px solid $gray600',
  padding: '$4 $6',
  borderRadius: 'md',

  marginBottom: '$2',
})

export const AuthError = styled(Text, {
  marginBottom: '$2',
  color: '#f75a68',
})
