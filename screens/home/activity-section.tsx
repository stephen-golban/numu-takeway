import { ArrowDownToLineIcon, ArrowUpFromLineIcon, ClockIcon } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { formatRelativeTime } from "@/lib/utils";

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
  isLoading?: boolean;
};

const ActivityRow: React.FC<{ activity: ActivityItem }> = ({ activity }) => {
  const isDeposit = activity.type === "deposit";
  const IconComponent = isDeposit ? ArrowDownToLineIcon : ArrowUpFromLineIcon;
  const label = isDeposit ? "Deposited" : "Withdrew";
  const iconColor = isDeposit ? "text-green-500" : "text-orange-500";
  const bgColor = isDeposit ? "bg-green-500/10" : "bg-orange-500/10";

  return (
    <View className="flex-row items-center gap-3 py-3">
      <View className={`size-10 items-center justify-center rounded-full ${bgColor}`}>
        <Icon as={IconComponent} className={iconColor} size={18} />
      </View>
      <View className="flex-1">
        <Text className="font-medium text-sm">
          {label} {activity.amount} {activity.symbol}
        </Text>
        <Text className="text-muted-foreground text-xs">{formatRelativeTime(activity.timestamp)}</Text>
      </View>
    </View>
  );
};

function ActivityRowSkeleton() {
  return (
    <View className="flex-row items-center gap-3 py-3">
      <Skeleton className="size-10 rounded-full bg-muted" />
      <View className="flex-1 gap-2">
        <Skeleton className="h-4 w-32 bg-muted" />
        <Skeleton className="h-3 w-20 bg-muted" />
      </View>
    </View>
  );
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ activities, isLoading = false }) => {
  if (isLoading) {
    return (
      <View className="gap-1">
        <ActivityRowSkeleton />
        <ActivityRowSkeleton />
        <ActivityRowSkeleton />
      </View>
    );
  }

  if (activities.length === 0) {
    return (
      <View className="items-center gap-3 py-8">
        <View className="size-12 items-center justify-center rounded-full bg-muted/50">
          <Icon as={ClockIcon} className="text-muted-foreground" size={24} />
        </View>
        <Text className="text-muted-foreground text-sm">No recent activity</Text>
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
};

export type { ActivityItem, ActivityType };
export { ActivitySection };
