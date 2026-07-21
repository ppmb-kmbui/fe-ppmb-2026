import type { ReactNode } from "react";

import { TaskAccessGate } from "./_components/TaskAccessGate";

export default function TasksLayout({ children }: { children: ReactNode }) {
  return <TaskAccessGate>{children}</TaskAccessGate>;
}
