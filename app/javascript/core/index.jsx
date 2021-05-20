import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

export default function Index() {
  return (
    <>
      <Router>
        <div className="main-content">
          <Switch>
            <Route path="/dashboard" render={() => <DashboardLayout />} />
            <Redirect from="/" to="/dashboard/companies" />
          </Switch>
        </div>
      </Router>
    </>
  );
}
