import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/home-blank')({
  component: () => <div className="min-h-screen bg-background" />,
});
