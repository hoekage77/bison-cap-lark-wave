import { useRef } from "react";
import { radialDeadzone, setStick } from "@/game/input";

export function Joystick() {
  const wrap = useRef<HTMLDivElement>(null);
  const pid = useRef<number | null>(null);

  const apply = (e: React.PointerEvent) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const nx = (e.clientX - cx) / (r.width / 2);
    const ny = (e.clientY - cy) / (r.height / 2);
    const v = radialDeadzone(nx, ny);
    const m = Math.hypot(v.x, v.y);
    const k = m > 1 ? 1 / m : 1;
    setStick(v.x * k, v.y * k);
  };

  return (
    <div
      ref={wrap}
      className="relative size-24 rounded-full border-2 border-ink/40 bg-cream/40 touch-none"
      onPointerDown={(e) => {
        pid.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        apply(e);
      }}
      onPointerMove={(e) => {
        if (pid.current !== e.pointerId) return;
        apply(e);
      }}
      onPointerUp={(e) => {
        if (pid.current !== e.pointerId) return;
        pid.current = null;
        setStick(0, 0);
      }}
      onPointerCancel={() => {
        pid.current = null;
        setStick(0, 0);
      }}
      aria-label="Move"
    >
      <span className="pointer-events-none absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/70" />
    </div>
  );
}
