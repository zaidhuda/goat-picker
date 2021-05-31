import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";

import { FirebaseContext } from "../contexts";
import useWeek from "../hooks/useWeek";
import useOptions from "../hooks/useOptions";

import withUser from "../components/withUser";
import Ranking from "../components/Ranking";

const GoatPage = () => {
  const { currentWeek, currentYear, getPrevWeek, getNextWeek } = useWeek();
  const { options, getVotes } = useContext(FirebaseContext);
  const { week: weekParam, year: yearParam } = useParams();

  const week = parseInt(weekParam, 10);
  const year = parseInt(yearParam, 10);

  let [votes, setVotes] = useState([]);

  const { votedOptions } = useOptions(options, votes);

  const prevWeekPath = () => {
    const { week: prevWeek, year: prevYear } = getPrevWeek(year, week);
    return `/goat/${prevYear}/${prevWeek}`;
  };

  const nextWeekPath = () => {
    const { week: nextWeek, year: nextYear } = getNextWeek(year, week);
    return `/goat/${nextYear}/${nextWeek}`;
  };

  useEffect(() => {
    setVotes([]);
    getVotes(year, week, setVotes);
  }, [getVotes, week, year]);

  return (
    <div className="space-y-8">
      <div>
        <Link to={prevWeekPath()} className="p-1 space-x-1">
          <NavigateBefore />
          <span>Previous Week</span>
        </Link>
        {!(week > currentWeek - 2 && year === currentYear) && (
          <Link to={nextWeekPath()} className="p-1 space-x-1">
            <span>Next Week</span>
            <NavigateNext />
          </Link>
        )}
      </div>

      <h1 className="font-light text-5xl">
        <span className="font-bold">GOAT</span>s of week {week}
      </h1>

      <Ranking options={votedOptions} />
    </div>
  );
};

export default withUser(GoatPage);
