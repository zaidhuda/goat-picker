import React from "react";

import withUser from "../components/withUser";
import Navbar from "../components/Navbar";

const VotesPage = () => {
  return (
    <div>
      <Navbar />
    </div>
  );
};

export default withUser(VotesPage);
