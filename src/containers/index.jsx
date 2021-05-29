import { Route, BrowserRouter, Switch } from "react-router-dom";

import { FirebaseContext } from "../contexts";
import useFirebase from "../hooks/useFirebase";

import LandingPage from "./LandingPage";
import VotePage from "./VotePage";
import StandingPage from "./StandingPage";

function App() {
  const firebase = useFirebase();

  return (
    <div className="container mx-auto">
      <FirebaseContext.Provider value={firebase}>
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={LandingPage}></Route>
            <Route path="/vote" component={VotePage}></Route>
            <Route path="/standing" component={StandingPage}></Route>
          </Switch>
        </BrowserRouter>
      </FirebaseContext.Provider>
    </div>
  );
}

export default App;
