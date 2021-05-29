import React from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";

export default function Admin(props) {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
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

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: "/assets/brand/argon-react.png",
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <Switch>
          {getRoutes(routes)}
          <Redirect from="*" to="/admin/index" />
        </Switch>
      </div>
    </>
  );
}
