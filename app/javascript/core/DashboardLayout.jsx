import React from 'react';
import NavBar from "./NavBar";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import routes from "./routes";

export default function DashboardLayout() {
  return (
    <>
      <NavBar />
      <Switch>
        { routes.map((route, index) => {
          return (
            <Route key={String(index)} path={route.path} component={route.component} />
          )
        })}
      </Switch>
    </>
  )
}