import {
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  ClockIcon,
} from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type ActivityType = "deposit" | "withdraw";

type ActivityItem = {
  id: string;
  type: ActivityType;
  amount: string;
  symbol: string;
  timestamp: Date;
  txHash?: string;
};

type ActivitySectionProps = {
  activities: ActivityItem[];
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return "Just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  return `${diffDays}d ago`;
}

function ActivityRow({ activity }: { activity: ActivityItem }) {
  const isDeposit = activity.type === "deposit";
  const IconComponent = isDeposit ? ArrowDownToLineIcon : ArrowUpFromLineIcon;
  const label = isDeposit ? "Deposited" : "Withdrew";
  const iconColor = isDeposit ? "text-green-500" : "text-orange-500";
  const bgColor = isDeposit ? "bg-green-500/10" : "bg-orange-500/10";

  return (
    <View className="flex-row items-center gap-3 py-3">
      <View
        className={`size-10 items-center justify-center rounded-full ${bgColor}`}
      >
        <Icon as={IconComponent} className={iconColor} size={18} />
      </View>
      <View className="flex-1">
        <Text className="font-medium text-sm">
          {label} {activity.amount} {activity.symbol}
        </Text>
        <Text className="text-muted-foreground text-xs">
          {formatRelativeTime(activity.timestamp)}
        </Text>
      </View>
    </View>
  );
}

export function ActivitySection({ activities }: ActivitySectionProps) {
  if (activities.length === 0) {
    return (
      <View className="items-center gap-3 py-8">
        <View className="size-12 items-center justify-center rounded-full bg-muted/50">
          <Icon as={ClockIcon} className="text-muted-foreground" size={24} />
        </View>
        <Text className="text-muted-foreground text-sm">
          No recent activity
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-1">
      {activities.map((activity) => (
        <ActivityRow activity={activity} key={activity.id} />
      ))}
    </View>
  );
}

export type { ActivityItem, ActivityType };
