import React, { useContext } from "react";

import { FirebaseContext } from "../contexts";

const Navbar = () => {
  const { signOut } = useContext(FirebaseContext);
  return (
    <nav>
      <button onClick={signOut}>Sign Out</button>
    </nav>
  );
};

export default Navbar;
