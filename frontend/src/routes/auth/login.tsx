import { LoginForm } from "@/components/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-dvh flex items-center justify-center">
      <LoginForm className="min-w-sm" />
    </div>
  );
}
