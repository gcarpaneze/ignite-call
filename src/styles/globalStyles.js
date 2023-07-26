import { globalCss } from '@ignite-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },

  body: {
    background: '$gray900',
    color: '$gray100',
    'webkit-font-smoothing': 'antialised',
  },
})
