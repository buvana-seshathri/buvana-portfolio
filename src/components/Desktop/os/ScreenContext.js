import { createContext, useContext } from 'react';

// Given to every window's content:
// - setGlow(color | null): tint this window's part of the monitor lights (e.g. the TV in Telly shows the
//   current pick's color); null goes back to the app's accent
// - open(key): open another app
export const ScreenContext = createContext({ setGlow: () => {}, open: () => {} });
export const useScreen = () => useContext(ScreenContext);
