import { WalletIcon } from "lucide-react-native";
import { View } from "react-native";
import { formatVaultCount } from "@/screens/home/util";
import type { VaultAsset } from "@/typings/vault";
import { AssetCard } from "./ui/asset-card";
import { EmptyState } from "./ui/empty-state";
import { Skeleton } from "./ui/skeleton";
import { Text } from "./ui/text";

type AssetsSectionProps = {
  vaults: VaultAsset[];
  onVaultPress: (vaultKey: string) => void;
  isLoading?: boolean;
};

function AssetCardSkeleton() {
  return (
    <View className="flex-row items-center gap-3 rounded-2xl bg-card p-4">
      <Skeleton className="size-12 rounded-full bg-muted" />
      <View className="flex-1 gap-2">
        <Skeleton className="h-4 w-24 bg-muted" />
        <Skeleton className="h-3 w-16 bg-muted" />
      </View>
      <View className="items-end gap-2">
        <Skeleton className="h-4 w-20 bg-muted" />
        <Skeleton className="h-3 w-14 bg-muted" />
      </View>
    </View>
  );
}

function AssetsSectionContent({
  vaults,
  onVaultPress,
  isLoading,
}: {
  vaults: VaultAsset[];
  onVaultPress: (vaultKey: string) => void;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <View className="gap-3">
        <AssetCardSkeleton />
        <AssetCardSkeleton />
        <AssetCardSkeleton />
      </View>
    );
  }

  if (vaults.length === 0) {
    return <EmptyState icon={WalletIcon} message="No vault positions yet. Deposit to get started." />;
  }

  return (
    <View className="gap-3">
      {vaults.map((vault) => (
        <AssetCard
          apy={vault.apy}
          balance={vault.shareBalance.toFixed(4)}
          color={vault.color}
          key={vault.vaultKey}
          name={vault.name}
          onPress={() => onVaultPress(vault.vaultKey)}
          symbol={vault.assetSymbol}
          usdValue={vault.usdValue}
        />
      ))}
    </View>
  );
}

const AssetsSection: React.FC<AssetsSectionProps> = ({ vaults, onVaultPress, isLoading = false }) => (
  <View className="gap-3 px-4">
    <View className="flex-row items-center justify-between">
      <Text className="font-semibold text-lg">Your Assets</Text>
      {!isLoading && <Text className="text-muted-foreground text-sm">{formatVaultCount(vaults.length)}</Text>}
    </View>
    <AssetsSectionContent isLoading={isLoading} onVaultPress={onVaultPress} vaults={vaults} />
  </View>
);

export { AssetsSection };
