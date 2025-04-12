'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function QueryClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div>{children}</div>
    </QueryClientProvider>
  );
}
