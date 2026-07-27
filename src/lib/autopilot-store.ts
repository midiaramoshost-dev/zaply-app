import { useCallback, useEffect, useState } from "react";

const KEY = "contentflow.autopilot.v1";
const EVENT = "contentflow:autopilot";

function read(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) !== "off";
}

export function useAutopilot() {
  const [autopilot, setAutopilotState] = useState(false);

  useEffect(() => {
    setAutopilotState(read());
    const sync = () => setAutopilotState(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setAutopilot = useCallback((value: boolean) => {
    window.localStorage.setItem(KEY, value ? "on" : "off");
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { autopilot, setAutopilot };
}
