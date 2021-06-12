import React, { useContext } from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";
import GlobalContext from "../helpers/Store";
import AdminNavbar from "../Navbars/AdminNavbar";
import Header from "../components/Headers/Header";

export default function Admin(props) {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const userData = useContext(GlobalContext);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin" && (!prop.role || prop.role === userData.role)) {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        path.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props.location.pathname)}
        />
        <Header />
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/admin/index" />
        </Switch>
      </div>
    </>
  );
}
