import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {router} from "@/router/router.tsx";
import {RouterProvider} from "react-router";
import {QueryClientProvider} from "@tanstack/react-query";
import queryClient from "@/clients/shared/queryClient.ts";

import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json'

countries.registerLocale(enLocale);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
      </QueryClientProvider>
  </StrictMode>,
)
