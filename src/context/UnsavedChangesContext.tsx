'use client'
import { createContext, useContext, useState } from 'react';

type UnsavedChangesContextType = {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  confirmNavigation: (callback: () => void) => void;
  popupVisible: boolean;
  setPopupVisible: (value: boolean) => void;
  proceedCallback: () => void;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextType>({
  hasUnsavedChanges: false,
  setHasUnsavedChanges: () => {},
  confirmNavigation: () => {},
  popupVisible: false,
  setPopupVisible: () => {},
  proceedCallback: () => {},
});

export const useUnsavedChanges = () => useContext(UnsavedChangesContext);

export const UnsavedChangesProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [proceedCallback, setProceedCallback] = useState<() => void>(() => () => {});

  const confirmNavigation = (callback: () => void) => {
    setProceedCallback(() => callback);
    setPopupVisible(true);
  };

  return (
    <UnsavedChangesContext.Provider
      value={{ hasUnsavedChanges, setHasUnsavedChanges, confirmNavigation, popupVisible, setPopupVisible, proceedCallback }}
    >
      {children}
    </UnsavedChangesContext.Provider>
  );
};