import { QueryClient } from "@tanstack/react-query";

const createAppQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: Infinity,
      },
    },
  });

export default createAppQueryClient;
