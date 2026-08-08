import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admmaster")({
  beforeLoad: () => {
    throw redirect({ to: "/admin" });
  },
});
