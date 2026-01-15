import {Navigate, Outlet} from "react-router";
import useApp, {selectors} from "@/hooks/useApp.ts";

function NotLoggedInLibrariansRoutes() {
  const isLoggedIn = useApp(selectors.librarians.isLoggedId);

  return !isLoggedIn
    ? <Outlet />
    : <Navigate to="/management/analytics" />
}

export default NotLoggedInLibrariansRoutes;