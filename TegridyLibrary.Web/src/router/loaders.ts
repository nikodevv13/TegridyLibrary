import {redirect} from "react-router";
import useApp from "@/hooks/useApp.ts";

export function redirectToHomePage() {
  return redirect('/management');
}

export function redirectToLoginPage() {
  return redirect('/management/login');
}

export function redirectNotLoggedInLibrarianToLoginPage() {
  const isLoggedIn = useApp.getState().isLoggedIn();
  return isLoggedIn ? null : redirectToLoginPage();
}

export function redirectLoggedInLibrarianToHomePage() {
  const isLoggedIn = useApp.getState().isLoggedIn();
  return isLoggedIn ? redirectToHomePage() : null;
}