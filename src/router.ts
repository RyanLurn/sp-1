import { createRouter } from "@tanstack/react-router";

import { DefaultErrorPage } from "@/components/default/error-page";
import { DefaultNotFoundPage } from "@/components/default/not-found-page";
import { routeTree } from "@/routeTree.gen";

export function getRouter() {
  const router = createRouter({
    defaultNotFoundComponent: DefaultNotFoundPage,
    defaultErrorComponent: DefaultErrorPage,
    scrollRestoration: true,
    routeTree,
  });

  return router;
}
