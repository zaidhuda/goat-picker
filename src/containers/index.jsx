import { Route, Switch, useLocation, Redirect } from "react-router-dom";

import LandingPage from "./LandingPage";
import VotePage from "./VotePage";
import UpcomingPage from "./UpcomingPage";
import GoatPage from "./GoatPage";

import FirebaseProvider from "../components/FirebaseProvider";

function App() {
  const { pathname } = useLocation();

  if (pathname === "/signout") return <Redirect to="/" />;

  return (
    <FirebaseProvider>
      <Switch>
        <Route path="/vote" component={VotePage}></Route>
        <Route path="/upcoming" component={UpcomingPage}></Route>
        <Route path="/goat/:year/:week" component={GoatPage}></Route>
        <Route path="/" component={LandingPage}></Route>
      </Switch>
    </FirebaseProvider>
  );
}

export default App;
