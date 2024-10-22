import { createContext, useContext } from "react";

interface FieldInversionContextProps {
  isFieldInverted: boolean;
  setIsFieldInverted: (v: boolean) => void;
}

export const FieldInversionContext = createContext<FieldInversionContextProps>({
  isFieldInverted: false,
  setIsFieldInverted: () => {
    throw new Error("not implemented");
  },
});

export function useFieldInversion() {
  return useContext(FieldInversionContext);
}
