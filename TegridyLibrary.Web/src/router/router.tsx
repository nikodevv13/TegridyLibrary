import { createBrowserRouter } from "react-router";
import LoggedInLibrarianRoutes from "./LoggedInLibrarianRoutes.tsx";
import NotLoggedInLibrariansRoutes from "./NotLoggedInLibrarianRoutes.tsx";
import {redirectLoggedInLibrarianToHomePage, redirectNotLoggedInLibrarianToLoginPage, redirectToHomePage} from "./loaders.ts";
import type {JSX} from "react";

function lazy<T>(importFunc: () => Promise<T>, componentSelector: (x: Awaited<T>) => () => JSX.Element){
  return async () => {
    const result = await importFunc();
    return { Component: componentSelector(result) };
  }
}

const routes = [
  {
    // Component: App,
    children: [
      {
        element: <LoggedInLibrarianRoutes />,
        loader: redirectNotLoggedInLibrarianToLoginPage,
        children: [
          {
            lazy: lazy(() => import("@/components/Layout.tsx"), x => x.default),
            children: [
              {
                path: "/management",
                children: [
                  {
                    path: "/management/librarians",
                    lazy: lazy(() => import("../pages/management/Librarians.page.tsx"), x => x.default),
                  },
                  {
                    path: "/management/readers",
                    lazy: lazy(() => import("../pages/management/Readers.page.tsx"), x => x.default),
                  },
                  {
                    path: "/management/book-loans",
                    lazy: lazy(() => import("../pages/management/BookLoans.page.tsx"), x => x.default),
                  }
                ]
              },
              {
                path: "/library",
                children: [
                  {
                    path: "/library/publishers",
                    lazy: lazy(() => import("../pages/library/Publishers.page.tsx"), x => x.default),
                  },
                  {
                    path: "/library/genres",
                    lazy: lazy(() => import("../pages/library/Genres.page.tsx"), x => x.default),
                  },
                  {
                    path: "/library/authors",
                    lazy: lazy(() => import("../pages/library/Authors.page.tsx"), x => x.default),
                  },
                  {
                    path: "/library/books",
                    lazy: lazy(() => import("../pages/library/books/Books.page.tsx"), x => x.default),
                  },
                  {
                    path: "/library/books/create",
                    lazy: lazy(() => import("../pages/library/books/CreateBook.page.tsx"), x => x.default),
                  },
                  {
                    path: "/library/books/:id",
                    lazy: lazy(() => import("../pages/library/books/UpdateBook.page.tsx"), x => x.default),
                  },
                ]
              },
            ],
          },
        ],
      },
      {
        element: <NotLoggedInLibrariansRoutes />,
        loader: redirectLoggedInLibrarianToHomePage,
        children: [
          {
            path: "/management/login",
            lazy: lazy(() => import("../pages/management/Login.page.tsx"), x => x.default),
          },
        ],
      },
      {
        path: "*",
        loader: redirectToHomePage,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);