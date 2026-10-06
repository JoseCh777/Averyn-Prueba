import type { Metadata } from "next";

import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export const metadata: Metadata = { title: "Dashboard · Averyn" };

/**
 * Página `/dashboard`: el dashboard base.
 *
 * @returns La pantalla del dashboard.
 */
export default function DashboardPage() {
  return <DashboardView />;
}
