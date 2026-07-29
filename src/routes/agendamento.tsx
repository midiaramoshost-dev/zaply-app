import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Plus, RotateCcw, Trash2, CalendarCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  WEEKDAYS,
  formatSlot,
  nextSlotDates,
  useSchedule,
} from "@/lib/schedule-store";

export const Route = createFileRoute("/agendamento")({
  head: () => ({
    meta: [
      { title: "Agendamento — grade de horários da IA | Zaply" },
      {
        name: "description",
        content:
          "Configure os dias e horários fixos de publicação. A IA respeita a grade ao agendar o conteúdo automaticamente.",
      },
      { property: "og:title", content: "Agendamento — grade de horários da IA" },
      {
        property: "og:description",
        content: "Defina Segunda 09:00, Quarta 14:00, Sexta 18:00 e deixe a IA seguir a sua grade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const { slots, ready, addSlot, updateSlot, removeSlot, resetSlots } = useSchedule();
  const [weekday, setWeekday] = useState("1");
  const [time, setTime] = useState("09:00");

  const preview = nextSlotDates(slots, new Date(), 6);

  const handleAdd = () => {
    const ok = addSlot(Number(weekday), time);
    toast[ok ? "success" : "error"](ok ? "Horário adicionado." : "Esse horário já existe.");
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Agendamento</h1>
        <p className="text-sm text-muted-foreground">
          Configure a grade fixa de publicação. A IA respeita os horários ao distribuir o conteúdo.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base">Configuração</CardTitle>
            <CardDescription>Dias e horários em que os posts serão publicados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {ready && slots.length === 0 && (
                <p className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
                  Nenhum horário configurado — a IA vai agendar 1 post por dia.
                </p>
              )}
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                    <Clock className="size-4" />
                  </span>
                  <Select
                    value={String(slot.weekday)}
                    onValueChange={(v) => updateSlot(slot.id, { weekday: Number(v) })}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEKDAYS.map((day, index) => (
                        <SelectItem key={day} value={String(index)}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="time"
                    className="w-[130px]"
                    value={slot.time}
                    aria-label={`Horário de ${WEEKDAYS[slot.weekday]}`}
                    onChange={(e) => updateSlot(slot.id, { time: e.target.value })}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-muted-foreground hover:text-destructive"
                    onClick={() => removeSlot(slot.id)}
                    aria-label={`Remover ${formatSlot(slot)}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-end gap-3 border-t border-border/60 pt-4">
              <div className="space-y-1.5">
                <Label>Dia</Label>
                <Select value={weekday} onValueChange={setWeekday}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WEEKDAYS.map((day, index) => (
                      <SelectItem key={day} value={String(index)}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-time">Horário</Label>
                <Input
                  id="new-time"
                  type="time"
                  className="w-[130px]"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <Button onClick={handleAdd}>
                <Plus className="mr-1.5 size-4" /> Adicionar
              </Button>
              <Button variant="outline" onClick={resetSlots}>
                <RotateCcw className="mr-1.5 size-4" /> Padrão
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base">A IA respeita os horários</CardTitle>
            <CardDescription>Próximas datas que serão usadas nos agendamentos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {preview.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Adicione ao menos um horário para ver a previsão.
              </p>
            )}
            {preview.map((date) => (
              <div
                key={date.toISOString()}
                className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-sm"
              >
                <CalendarCheck className="size-4 text-primary" />
                <span className="capitalize">
                  {date.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
                <Badge variant="secondary" className="ml-auto">
                  {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
