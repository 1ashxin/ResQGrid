import { createContext, useContext, useState } from "react";

const RequestContext = createContext();

export function RequestProvider({ children }) {
  const [requestStatus, setRequestStatus] = useState("idle");

  const [requestData, setRequestData] = useState(null);

  return (
    <RequestContext.Provider
      value={{
        requestStatus,
        setRequestStatus,
        requestData,
        setRequestData,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequest() {
  return useContext(RequestContext);
}