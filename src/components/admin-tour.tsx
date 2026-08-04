import { useEffect, useState } from "react";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";

const TOUR_KEY = "zaply-admin-tour-completed";

export function AdminTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_KEY);
    if (!completed) {
      const timer = setTimeout(() => setRun(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      localStorage.setItem(TOUR_KEY, "true");
      setRun(false);
    }
  };

  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      content: (
        <div className="text-left">
          <h3 className="text-lg font-bold text-primary">Bem-vindo, Mestre! 🚀</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Este é o seu centro de comando. Vamos mostrar como gerenciar a plataforma Zaply em poucos segundos.
          </p>
        </div>
      ),
    },
    {
      target: ".kpi-grid",
      content: "Aqui você acompanha os números reais da plataforma: usuários, posts e o engajamento geral.",
      title: "Visão Geral",
    },
    {
      target: '[role="tablist"]',
      content: "Alterne entre a gestão de usuários e o controle fino de créditos.",
      title: "Navegação",
    },
    {
      target: ".user-table-card",
      content: "Nesta tabela você libera novos usuários, bloqueia acessos e promove outros administradores.",
      title: "Gestão de Usuários",
    },
    {
      target: ".btn-new-user",
      content: "Use este botão para adicionar novos clientes manualmente à plataforma.",
      title: "Novos Clientes",
    },
    {
      target: ".btn-grant-credits",
      content: "O coração do sistema! Aqui você adiciona créditos para que os usuários possam gerar conteúdos com IA.",
      title: "Créditos e Bônus",
    },
  ];

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          arrowColor: "oklch(var(--b1))",
          backgroundColor: "oklch(var(--b1))",
          overlayColor: "rgba(0, 0, 0, 0.75)",
          primaryColor: "oklch(var(--p))",
          textColor: "oklch(var(--bc))",
          zIndex: 1000,
        },
        tooltip: {
          textAlign: "left",
          borderRadius: "var(--radius-lg)",
          backgroundColor: "oklch(var(--b1))",
          color: "oklch(var(--bc))",
        },
        buttonNext: {
          borderRadius: "var(--radius-md)",
          fontWeight: "bold",
        },
        buttonBack: {
          marginRight: 10,
        },
      }}
      locale={{
        back: "Voltar",
        close: "Fechar",
        last: "Finalizar",
        next: "Próximo",
        skip: "Pular tour",
      }}
    />
  );
}
