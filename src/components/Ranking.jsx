import React from "react";
// import React, { useState } from "react";
import PropTypes from "prop-types";
import { Flipper } from "react-flip-toolkit";

import OptionCard from "./OptionCard";
import { useLocation } from "react-router";

// const mockData = [
//   {
//     id: "6217cb3d-3106-418f-a4b1-e68b34a1ab1d",
//     displayName: "Alfi Piggen",
//     photoURL:
//       "https://robohash.org/aspernaturvoluptasvoluptas.png?size=50x50&set=set1",
//     votes: 87,
//   },
//   {
//     id: "3c6c1a87-ddfc-446f-ae0c-b9f6970fd361",
//     displayName: "Flint Luscott",
//     photoURL:
//       "https://robohash.org/maximedistinctiotempore.png?size=50x50&set=set1",
//     votes: 30,
//   },
//   {
//     id: "1558f07b-4fe3-48dc-9c83-56923bf92e74",
//     displayName: "Fletch Tather",
//     photoURL: "https://robohash.org/estimpeditid.png?size=50x50&set=set1",
//     votes: 34,
//   },
//   {
//     id: "1999430f-b1ea-4229-a2eb-aab36b23ff3e",
//     displayName: "Missie Scarth",
//     photoURL:
//       "https://robohash.org/excepturietexplicabo.png?size=50x50&set=set1",
//     votes: 42,
//   },
//   {
//     id: "b9266f7f-a016-4ae6-96c6-dac6656e921f",
//     displayName: "Dode Pull",
//     photoURL: "https://robohash.org/hicidquaerat.png?size=50x50&set=set1",
//     votes: 45,
//   },
//   {
//     id: "6bbabf8a-e641-42a2-9b90-97e0bbc3ed84",
//     displayName: "Doyle Hatliff",
//     photoURL: "https://robohash.org/liberonostrumnon.png?size=50x50&set=set1",
//     votes: 9,
//   },
//   {
//     id: "dcf7cc24-cbdd-4755-bc61-9ccf2cad8813",
//     displayName: "Rriocard Rodell",
//     photoURL: "https://robohash.org/utealibero.png?size=50x50&set=set1",
//     votes: 23,
//   },
//   {
//     id: "f7190006-ab23-4059-a6db-3fe273dc0922",
//     displayName: "Shannon Poure",
//     photoURL:
//       "https://robohash.org/doloremconsecteturillo.png?size=50x50&set=set1",
//     votes: 5,
//   },
//   {
//     id: "041d9f25-adb9-4f48-8a74-424b3f4681da",
//     displayName: "Christy Crier",
//     photoURL: "https://robohash.org/errorsequiculpa.png?size=50x50&set=set1",
//     votes: 20,
//   },
//   {
//     id: "12ca406a-8541-4ac3-a6a2-a997226c0491",
//     displayName: "Joni Jerrim",
//     photoURL:
//       "https://robohash.org/pariaturdoloresalias.png?size=50x50&set=set1",
//     votes: 88,
//   },
//   {
//     id: "a8a0a936-2674-4b81-8509-6b1771a41c02",
//     displayName: "Annecorinne Whitlam",
//     photoURL:
//       "https://robohash.org/inciduntquismolestiae.png?size=50x50&set=set1",
//     votes: 40,
//   },
//   {
//     id: "64225b3d-ea25-493e-a118-7192a16985d1",
//     displayName: "Jaimie Bichard",
//     photoURL: "https://robohash.org/sequihicab.png?size=50x50&set=set1",
//     votes: 12,
//   },
//   {
//     id: "6e68a843-7bf3-4610-af7a-cf78dd00140b",
//     displayName: "Burlie Duffett",
//     photoURL: "https://robohash.org/quiaquaeut.png?size=50x50&set=set1",
//     votes: 59,
//   },
//   {
//     id: "d3c5cbfd-a2f0-4e03-89a1-0cad78414ed8",
//     displayName: "Laurens Spraberry",
//     photoURL: "https://robohash.org/animibeataesint.png?size=50x50&set=set1",
//     votes: 15,
//   },
//   {
//     id: "f3b7fac2-abca-4bf7-be3b-eddc61827d54",
//     displayName: "Jessika Glancey",
//     photoURL: "https://robohash.org/rerumullamquisquam.png?size=50x50&set=set1",
//     votes: 25,
//   },
//   {
//     id: "f9741536-0d1b-44ff-927f-c5e3c297052f",
//     displayName: "Eddy Hlavac",
//     photoURL: "https://robohash.org/autrerumexplicabo.png?size=50x50&set=set1",
//     votes: 99,
//   },
//   {
//     id: "e253614f-97b0-4f10-b907-e0572f9c7e60",
//     displayName: "Delcine Worstall",
//     photoURL: "https://robohash.org/rationenihilipsa.png?size=50x50&set=set1",
//     votes: 12,
//   },
//   {
//     id: "9231baa1-c4c0-414f-87de-9cfb007ac3d7",
//     displayName: "Carrol Boni",
//     photoURL: "https://robohash.org/aliquamhicat.png?size=50x50&set=set1",
//     votes: 76,
//   },
//   {
//     id: "134a83f0-2df6-428b-9be7-611f0de87a15",
//     displayName: "Donaugh Jeffcoate",
//     photoURL: "https://robohash.org/doloreetaliquam.png?size=50x50&set=set1",
//     votes: 91,
//   },
//   {
//     id: "70bf6ef3-64a1-4f55-836e-ebf14c37e79d",
//     displayName: "Terrell Perazzo",
//     photoURL: "https://robohash.org/etrepellenduset.png?size=50x50&set=set1",
//     votes: 27,
//   },
//   {
//     id: "c1fb5112-18f3-41ae-acc5-5b9fa9be3701",
//     displayName: "Phineas Bromehed",
//     photoURL: "https://robohash.org/etducimussed.png?size=50x50&set=set1",
//     votes: 64,
//   },
//   {
//     id: "801df725-7a1d-4243-b043-3fe81d873c5b",
//     displayName: "Andriette Skarr",
//     photoURL:
//       "https://robohash.org/nesciunttemporaeveniet.png?size=50x50&set=set1",
//     votes: 49,
//   },
//   {
//     id: "430c0710-126b-45bd-b4a0-0edf36dc86a8",
//     displayName: "Fonz Cartmill",
//     photoURL:
//       "https://robohash.org/facilissuntrecusandae.png?size=50x50&set=set1",
//     votes: 39,
//   },
// ];

// function moveRandom(arr) {
//   const len = arr.length - 1;
//   const from = Math.random() * len;
//   const to = Math.random() * len;
//   if (to >= arr.length) {
//     var k = to - arr.length;
//     while (k-- + 1) {
//       arr.push(undefined);
//     }
//   }
//   arr.splice(to, 0, arr.splice(from, 1)[0]);
//   return arr;
// }

const Ranking = ({ options }) => {
  const { pathname } = useLocation();
  // const [, setTime] = useState(Date.now);
  // const [options, setOptions] = useState(mockData);

  return (
    <>
      {/* <button
        onClick={() => {
          setOptions(moveRandom(options));
          setTime(Date.now);
        }}
      >
        shuffle
      </button> */}
      <Flipper flipKey={`${pathname}-${options.map(({ id }) => id).join()}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {options.map(({ id, displayName, photoURL }) => (
            <OptionCard
              key={id}
              id={id}
              displayName={displayName}
              photoURL={photoURL}
            />
          ))}
        </div>
      </Flipper>
    </>
  );
};

Ranking.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Ranking;
