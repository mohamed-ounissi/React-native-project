import { createContext, useContext } from "react";

export type LayoutMode = "cards" | "grid";

type LayoutModeContextValue = {
  mode: LayoutMode;
  toggleMode: () => void;
};

export const LayoutModeContext = createContext<LayoutModeContextValue | undefined>(
  undefined
);

export const useLayoutMode = (): LayoutModeContextValue => {
  const context = useContext(LayoutModeContext);

  if (!context) {
    throw new Error("useLayoutMode must be used within LayoutModeContext provider.");
  }

  return context;
};
