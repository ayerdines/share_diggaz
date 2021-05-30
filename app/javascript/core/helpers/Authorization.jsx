import GlobalContext from "./Store";
import { useContext } from "react";


export default function adminCanAccess() {
  const userData = useContext(GlobalContext);
  return userData.role === 'admin';
}
