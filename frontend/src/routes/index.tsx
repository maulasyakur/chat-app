import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({ to: "/chat" });
    } else {
      throw redirect({ to: "/auth/login" });
    }
  },
});
