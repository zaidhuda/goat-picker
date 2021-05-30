import { Route, BrowserRouter, Switch } from "react-router-dom";

import { FirebaseContext } from "../contexts";
import useFirebase from "../hooks/useFirebase";

import LandingPage from "./LandingPage";
import VotePage from "./VotePage";
import StandingPage from "./StandingPage";

function App() {
  const firebase = useFirebase();

  return (
    <FirebaseContext.Provider value={firebase}>
      <BrowserRouter>
        <Switch>
          <Route path="/vote" component={VotePage}></Route>
          <Route path="/standing" component={StandingPage}></Route>
          <Route path="/goat/:year/:week" component={StandingPage}></Route>
          <Route path="/" component={LandingPage}></Route>
        </Switch>
      </BrowserRouter>
    </FirebaseContext.Provider>
  );
}

export default App;
