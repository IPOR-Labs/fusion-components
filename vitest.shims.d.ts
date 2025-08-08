/// <reference types="vitest/globals" />

declare global {
  interface Window {
    ResizeObserver: any;
    PointerEvent: any;
  }
}

export {};
