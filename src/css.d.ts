declare module 'csstype' {
  interface Properties {
    // Allow namespaced CSS Custom Properties
    [index: `--custom-${string}`]: any;
  }
}
