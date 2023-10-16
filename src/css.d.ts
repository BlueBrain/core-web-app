import type * as CSS from 'csstype';

declare module 'csstype' {
  interface Properties extends CSS.Properties {
    /**
     * Allow namespaced CSS Custom Properties.
     * Example:
     *   <div style={{ "--custom-size": "64px" }}>...</div>
     */
    [index: `--custom-${string}`]: any;
  }
}
