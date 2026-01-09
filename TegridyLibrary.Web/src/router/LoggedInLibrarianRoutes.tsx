import {Navigate, Outlet} from "react-router";
import useApp, {selectors} from "@/hooks/useApp.ts";

function LoggedInLibrarianRoutes() {
  const isLoggedIn = useApp(selectors.librarians.isLoggedId);

  return isLoggedIn
    ? <Outlet />
    : <Navigate to="/management/login" />
}

export default LoggedInLibrarianRoutes;