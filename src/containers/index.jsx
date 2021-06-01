import { Route } from "react-router-dom";
import { AnimatedSwitch, AnimatedRoute } from "react-router-transition";

import LandingPage from "./LandingPage";
import VotePage from "./VotePage";
import UpcomingPage from "./UpcomingPage";
import GoatPage from "./GoatPage";
import Navbar from "../components/Navbar";

import FirebaseProvider from "../components/FirebaseProvider";

function App() {
  return (
    <FirebaseProvider>
      <AnimatedSwitch
        atEnter={{ opacity: 0, top: -400 }}
        atLeave={{ opacity: 0, top: 400 }}
        atActive={{ opacity: 1, top: 0 }}
        className="switch-wrapper"
      >
        <Route path="/" exact component={LandingPage} />
      </AnimatedSwitch>
      <AnimatedRoute
        atEnter={{ opacity: 0 }}
        atLeave={{ opacity: 0 }}
        atActive={{ opacity: 1 }}
        path={["/vote", "/upcoming", "/goat/:year/:week"]}
        component={Navbar}
      />
      <AnimatedSwitch
        atEnter={{ opacity: 0, left: 400 }}
        atLeave={{ opacity: 0, left: -400 }}
        atActive={{ opacity: 1, left: 0 }}
        className="switch-wrapper"
      >
        <Route path="/vote" component={VotePage} />
        <Route path="/upcoming" component={UpcomingPage} />
        <Route path="/goat/:year/:week" component={GoatPage} />
      </AnimatedSwitch>
    </FirebaseProvider>
  );
}

export default App;
