import { useCallback, useEffect, useState } from "react";

export type ScheduleSlot = {
  id: string;
  /** 0 = domingo ... 6 = sábado */
  weekday: number;
  time: string;
};

export const WEEKDAYS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

const STORAGE_KEY = "contentflow.schedule.v1";
const EVENT = "contentflow:schedule";

const DEFAULT_SLOTS: ScheduleSlot[] = [
  { id: "slot-seg", weekday: 1, time: "09:00" },
  { id: "slot-qua", weekday: 3, time: "14:00" },
  { id: "slot-sex", weekday: 5, time: "18:00" },
];

function read(): ScheduleSlot[] {
  if (typeof window === "undefined") return DEFAULT_SLOTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SLOTS));
      return DEFAULT_SLOTS;
    }
    const parsed = JSON.parse(raw) as ScheduleSlot[];
    return Array.isArray(parsed) ? parsed : DEFAULT_SLOTS;
  } catch {
    return DEFAULT_SLOTS;
  }
}

function write(slots: ScheduleSlot[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sortSlots(slots)));
  window.dispatchEvent(new Event(EVENT));
}

export function sortSlots(slots: ScheduleSlot[]) {
  return [...slots].sort((a, b) => a.weekday - b.weekday || a.time.localeCompare(b.time));
}

export function useSchedule() {
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSlots(sortSlots(read()));
    setReady(true);
    const sync = () => setSlots(sortSlots(read()));
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addSlot = useCallback((weekday: number, time: string) => {
    const current = read();
    if (current.some((s) => s.weekday === weekday && s.time === time)) return false;
    write([...current, { id: crypto.randomUUID(), weekday, time }]);
    return true;
  }, []);

  const updateSlot = useCallback((id: string, patch: Partial<ScheduleSlot>) => {
    write(read().map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const removeSlot = useCallback((id: string) => {
    write(read().filter((s) => s.id !== id));
  }, []);

  const resetSlots = useCallback(() => write(DEFAULT_SLOTS), []);

  return { slots, ready, addSlot, updateSlot, removeSlot, resetSlots };
}

/**
 * Gera as próximas `count` datas que respeitam os horários configurados,
 * a partir de `from` (inclusive).
 */
export function nextSlotDates(slots: ScheduleSlot[], from: Date, count: number): Date[] {
  const ordered = sortSlots(slots);
  if (ordered.length === 0 || count <= 0) return [];

  const dates: Date[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);

  for (let day = 0; day < 400 && dates.length < count; day++) {
    const current = new Date(cursor);
    current.setDate(current.getDate() + day);
    for (const slot of ordered.filter((s) => s.weekday === current.getDay())) {
      const [hour, minute] = slot.time.split(":").map(Number);
      const date = new Date(current);
      date.setHours(hour || 0, minute || 0, 0, 0);
      if (date.getTime() < from.getTime()) continue;
      dates.push(date);
      if (dates.length === count) break;
    }
  }

  return dates;
}

export function formatSlot(slot: ScheduleSlot) {
  return `${WEEKDAYS[slot.weekday]} · ${slot.time}`;
}
