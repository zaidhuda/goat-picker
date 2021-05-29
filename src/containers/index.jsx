import { Route, BrowserRouter, Switch } from "react-router-dom";

import { FirebaseContext } from "../contexts";
import useFirebase from "../hooks/useFirebase";

import LandingPage from "./LandingPage";
import VotesPage from "./VotesPage";

function App() {
  const firebase = useFirebase();

  return (
    <FirebaseContext.Provider value={firebase}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={LandingPage}></Route>
          <Route path="/votes" component={VotesPage}></Route>
        </Switch>
      </BrowserRouter>
    </FirebaseContext.Provider>
  );
}

export default App;
