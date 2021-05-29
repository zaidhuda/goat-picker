import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { FirebaseContext } from "../contexts";

const Navbar = () => {
  const { signOut } = useContext(FirebaseContext);
  return (
    <nav>
      <Link to="/vote">Vote</Link>
      <Link to="/standing">Standing</Link>
      <button onClick={signOut}>Sign Out</button>
    </nav>
  );
};

export default Navbar;
