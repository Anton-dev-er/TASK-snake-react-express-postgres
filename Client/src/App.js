import SnakePage from "./pages/SnakePage";
import React, { useState } from "react";

export const UserContext = React.createContext(undefined);

function App() {
  const [user, setUser] = useState({
    id: undefined,
    username: "",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SnakePage />
    </UserContext.Provider>
  );
}

export default App;
