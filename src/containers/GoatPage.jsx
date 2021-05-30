import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";

import { FirebaseContext } from "../contexts";
import useWeek from "../hooks/useWeek";

import withUser from "../components/withUser";

const GoatPage = () => {
  const {
    week: currentWeek,
    year: currentYear,
    getPreviousWeek,
    getNextWeek,
  } = useWeek();
  const { options, getVotes } = useContext(FirebaseContext);
  const { week: weekParam, year: yearParam } = useParams();

  const week = parseInt(weekParam, 10);
  const year = parseInt(yearParam, 10);

  let [votes, setVotes] = useState([]);

  const optionVotes = votes
    .flatMap(({ votes }) => votes)
    .reduce((res, vote) => ({ [vote]: (res[vote] || 0) + 1 }), {});

  const previousWeek = () => {
    const { week: previousWeek, year: previousYear } = getPreviousWeek(
      year,
      week
    );
    return `/goat/${previousYear}/${previousWeek}`;
  };

  const nextWeek = () => {
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
        <Link to={previousWeek()} className="p-1 space-x-1">
          <NavigateBefore />
          <span>Previous Week</span>
        </Link>
        {!(week > currentWeek - 2 && year === currentYear) && (
          <Link to={nextWeek()} className="p-1 space-x-1">
            <span>Next Week</span>
            <NavigateNext />
          </Link>
        )}
      </div>
      <h1 className="font-bold text-6xl">
        GOAT <span className="font-light">of week {week}</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ul className="space-y-1">
          {options
            .map((option) => ({
              ...option,
              votes: optionVotes[option.id],
            }))
            .filter(({ votes }) => votes)
            .sort((a, b) => b.votes - a.votes)
            .map(({ id, displayName, photoURL }) => (
              <li key={id}>
                <img
                  src={photoURL}
                  alt={displayName}
                  className="inline mr-2 rounded-full w-10"
                />
                <span>{displayName}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default withUser(GoatPage);
