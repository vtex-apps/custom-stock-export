/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'vtex.styleguide' {
  import type { ComponentType } from 'react'
  
  export const Input: ComponentType<InputProps>

  interface InputProps {
    [key: string]: any
  }
}
