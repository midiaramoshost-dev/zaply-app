import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/configuracao-api')({
  component: APIConfigPage,
});

function APIConfigPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Configuração de APIs</h1>
      <p className="text-muted-foreground">Esta página está pronta para receber as configurações das APIs conforme solicitado.</p>
    </div>
  );
}
