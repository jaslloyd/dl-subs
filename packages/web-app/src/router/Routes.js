import React from "react";
import { Switch, Route } from "react-router-dom";
import SubsFormContainer from "../containers/SubsFormContainer";
// import HistoricalView from '../HistoricalView';
import TeamView from "../components/TeamView";
import Login from "../components/Login";
import Pay from "../components/Pay";
import Register from "../components/Register";
import PaymentConfirmation from "../components/PaymentConfirmation";
import PrivateRoute from "./PrivateRoute";

export default () => (
  <main>
    <Switch>
      <Route exact path="/login" component={Login} />
      <PrivateRoute exact path="/" component={SubsFormContainer} />
      <PrivateRoute exact path="/register" component={Register} />
      <PrivateRoute exact path="/teams" component={TeamView} />
      <Route exact path="/pay" component={Pay} />
      <Route
        exact
        path="/paymentConfirmation/:code"
        component={PaymentConfirmation}
      />
    </Switch>
  </main>
);
