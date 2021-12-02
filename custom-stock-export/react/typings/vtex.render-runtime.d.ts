import 'vtex.render-runtime'

// FIXME: remove uncessary typings declarations when vtex.render-runtime exports them properly.
// Since we're using `import type`, these import statements are clear for now
declare module 'vtex.render-runtime' {
  import type {
    RenderContext as _RenderContext,
    withRuntimeContext as _withRuntimeContext,
  } from 'vtex.render-runtime/react/components/RenderContext'

  export type RenderContext = _RenderContext

  export const withRuntimeContext: _withRuntimeContext
}
