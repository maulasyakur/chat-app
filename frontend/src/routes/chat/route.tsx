import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({ to: "/auth/login" });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
