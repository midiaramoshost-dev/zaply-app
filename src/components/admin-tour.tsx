import { useEffect, useState } from "react";
import { Joyride, STATUS, type EventData, type Step } from "react-joyride";

const TOUR_KEY = "zaply-admin-tour-completed";

export function AdminTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(TOUR_KEY)) {
      const timer = setTimeout(() => setRun(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleEvent(data: EventData) {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      localStorage.setItem(TOUR_KEY, "true");
      setRun(false);
    }
  }

  const steps: Step[] = [
    {
      target: "body",
      placement: "bottom",
      title: "Bem-vindo ao painel master",
      content:
        "Este é o seu centro de comando. Vamos mostrar como gerenciar a plataforma Zaply em poucos segundos.",
    },
    {
      target: ".kpi-grid",
      title: "Visão geral",
      content:
        "Aqui você acompanha os números reais da plataforma: usuários, clientes, posts e comentários.",
    },
    {
      target: ".user-table-card",
      title: "Gestão de usuários",
      content:
        "Nesta tabela você libera novos usuários, bloqueia acessos e promove outros administradores.",
    },
    {
      target: ".btn-new-user",
      title: "Novos clientes",
      content: "Use este botão para adicionar novos clientes manualmente à plataforma.",
    },
    {
      target: ".btn-grant-credits",
      title: "Créditos e bônus",
      content:
        "Aqui você adiciona créditos Zaply para que os usuários possam gerar conteúdos com IA.",
    },
    {
      target: '[value="ia"]',
      title: "Central de IA",
      content: "Gerencie os provedores (Google, OpenAI, Anthropic) de forma invisível. O cliente final sempre verá apenas a marca Zaply.",
    },
    {
      target: '[value="sistema"]',
      title: "Automação Real",
      content: "Vincule as APIs oficiais das redes sociais e configure o n8n para automação total.",
    },
  ];

  return (
    <Joyride
      continuous
      run={run}
      scrollToFirstStep
      steps={steps}
      onEvent={handleEvent}
      options={{
        buttons: ["back", "skip", "primary"],
        arrowColor: "#0b1220",
        backgroundColor: "#0b1220",
        overlayColor: "rgba(0, 0, 0, 0.75)",
        primaryColor: "#3b82f6",
        textColor: "#e5e7eb",
        zIndex: 1000,
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
