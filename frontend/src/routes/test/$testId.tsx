import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/test/$testId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/test/$testId"!</div>;
}
