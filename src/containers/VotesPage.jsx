import React, { useContext, useEffect, useState } from "react";

import { FirebaseContext } from '../contexts'

import withUser from "../components/withUser";
import Navbar from "../components/Navbar";
import Selection from "../components/Selection";

const VotesPage = () => {
  const { getOptions } = useContext(FirebaseContext);
  const [options, setOptions] = useState([]);
  
  useEffect(()=>{
    getOptions(setOptions)
  }, [getOptions]);

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {options.map(({id, ...option}) => <Selection key={id} {...option} />)}
      </div>
    </div>
  );
};

export default withUser(VotesPage);
