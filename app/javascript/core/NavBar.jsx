import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Nav, Navbar,
  NavItem,
} from "reactstrap";
import routes from "./routes";

export default function NavBar() {
  return (
    <>
      <h1>Share Diggaz</h1>
      <hr />
      <Nav className="mr-auto" tabs>
        { routes && routes.map((route, index) => {
          return (
            <NavItem key={String(index)}>
              <NavLink className="nav-link" to={route.path}>{route.name}</NavLink>
            </NavItem>
          )
        })}
      </Nav>
    </>
  )
}