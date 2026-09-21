"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  MessageSquare,
  Grid,
  ArrowRightLeft,
  Filter,
  ShieldAlert,
  Lightbulb,
  Calculator,
  Sparkles,
  CheckSquare,
  Award,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-voc", label: "Add VOC / Screener", icon: PlusCircle, highlight: true },
  { href: "/respondents", label: "Respondents Directory", icon: Users },
  { href: "/interviews", label: "In-depth Interviews", icon: MessageSquare },
  { href: "/occasions", label: "Payment Occasions", icon: Grid },
  { href: "/app-choice", label: 'App Choice & "Why Not?"', icon: ArrowRightLeft },
  { href: "/funnel", label: "Switching Funnel", icon: Filter },
  { href: "/barriers", label: "Barrier Analysis", icon: ShieldAlert },
  { href: "/insights", label: "Insight Engine", icon: Lightbulb },
  { href: "/opportunity", label: "GMV Opportunity", icon: Calculator },
  { href: "/solutions", label: "Solution Concepts", icon: Sparkles },
  { href: "/validation", label: "Solution Validation", icon: CheckSquare },
  { href: "/quality-control", label: "Research Quality Control", icon: Award },
  { href: "/data-io", label: "Data Import & Export", icon: FileSpreadsheet },
  { href: "/submission", label: "Official 2-Page PDF", icon: FileText, special: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col border-r border-slate-800 shrink-0">
      <div className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Research Workspace
      </div>
      <nav className="flex-1 px-3 space-y-1 pb-6">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-paytm-navy text-paytm-cyan font-semibold border-l-4 border-paytm-cyan shadow-sm"
                  : item.special
                  ? "bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/60"
                  : item.highlight
                  ? "bg-paytm-cyan/10 text-paytm-cyan hover:bg-paytm-cyan/20 border border-paytm-cyan/30"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-paytm-cyan" : item.special ? "text-emerald-400" : ""}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400">
        <div className="font-semibold text-slate-300 mb-1">Track A Screening Constraint</div>
        <p className="leading-relaxed">
          Screening enforces: Used Paytm last 90d + Paytm is NOT current primary app.
        </p>
      </div>
    </aside>
  );
}
