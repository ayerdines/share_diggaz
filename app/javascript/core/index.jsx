import React, { createContext } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import AdminLayout from './layouts/Admin';
import GlobalContext from './helpers/Store';

export default function Index({ data }) {
  return (
    <>
      <GlobalContext.Provider value={data}>
        <BrowserRouter>
          <Switch>
            <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
            <Redirect from="/" to="/admin/index" />
          </Switch>
        </BrowserRouter>
      </GlobalContext.Provider>
    </>
  );
}
