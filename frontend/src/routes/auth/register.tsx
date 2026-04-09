import { RegisterForm } from "@/components/register-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <RegisterForm className="w-full max-w-sm" />
    </div>
  );
}
