import React, { ReactNode, createContext, useContext } from "react";

interface IProps {
  children: ReactNode;
  state: any;
}

function GlobalReducerContext({ children, state }: IProps) {
  const GlobalStateContext = createContext(state);
  return (
    <GlobalStateContext.Provider value={state}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export default GlobalReducerContext;
