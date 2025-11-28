import { ChartLineIcon, CoinsIcon, ShieldCheckIcon } from "lucide-react-native";

export const FEATURES = [
  {
    icon: CoinsIcon,
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
    title: "Earn Yield",
    description: "Deposit into yoUSD, yoETH & yoBTC vaults",
  },
  {
    icon: ChartLineIcon,
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-500",
    title: "Low Fees",
    description: "Built on Base with minimal gas costs",
  },
  {
    icon: ShieldCheckIcon,
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-500",
    title: "Secure",
    description: "Audited YO Protocol smart contracts",
  },
] as const;
