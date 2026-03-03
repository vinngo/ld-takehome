"use client";

import * as React from "react";
import { motion, useSpring } from "framer-motion";

interface HoverCaptionProps {
  caption: string;
  initialX: number;
  initialY: number;
}

const spring = { damping: 20, stiffness: 200, restDelta: 0.01 };

export function HoverCaption({
  caption,
  initialX,
  initialY,
}: HoverCaptionProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const initialized = React.useRef(false);

  const left = useSpring(initialX, spring);
  const top = useSpring(initialY - 30, spring);

  React.useLayoutEffect(() => {
    if (!initialized.current) {
      const element = ref.current;
      const offsetX = element ? element.offsetWidth / 2 : 0;
      const offsetY = element ? element.offsetHeight + 10 : 30;

      left.jump(initialX - offsetX);
      top.jump(initialY - offsetY);
      initialized.current = true;
    }
  }, [initialX, initialY, left, top]);

  React.useEffect(() => {
    const handlePointerMove = ({ clientX, clientY }: MouseEvent) => {
      const element = ref.current;
      const offsetX = element ? element.offsetWidth / 2 : 0;
      const offsetY = element ? element.offsetHeight + 10 : 20;

      left.set(clientX - offsetX);
      top.set(clientY - offsetY);
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [left, top]);

  return (
    <motion.div
      ref={ref}
      className="fixed border bg-background text-foreground p-2 rounded-sm shadow-lg pointer-events-none z-50 font-mono text-sm"
      style={{ left, top }}
    >
      {caption}
    </motion.div>
  );
}
