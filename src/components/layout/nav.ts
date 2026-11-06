import {
  Award,
  BriefcaseBusiness,
  FolderKanban,
  LayoutDashboard,
  Route,
  SquareTerminal,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const workspaceNav: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/parcours", label: "Mon parcours", icon: Route },
  { href: "/missions", label: "Missions", icon: SquareTerminal },
  { href: "/projets", label: "Mes projets", icon: FolderKanban },
  { href: "/competences", label: "Mes compétences", icon: Award },
];

export const portfolioNav: NavItem = {
  href: "/portfolio",
  label: "Mon portfolio",
  icon: BriefcaseBusiness,
};

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
