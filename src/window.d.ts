export {};
declare global {
  interface Window {
    officeWindow?: {
      close: () => void;
      minimize: () => void;
      toggleFullScreen: () => void;
    };
  }
}
