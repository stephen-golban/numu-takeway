import { WalletIcon } from "lucide-react-native";
import { View } from "react-native";
import { formatVaultCount } from "@/screens/home/util";
import type { VaultAsset } from "@/typings/vault";
import { AssetCard } from "./ui/asset-card";
import { EmptyState } from "./ui/empty-state";
import { Text } from "./ui/text";

type AssetsSectionProps = {
  vaults: VaultAsset[];
  onVaultPress: (vaultKey: string) => void;
};

const AssetsSection: React.FC<AssetsSectionProps> = ({ vaults, onVaultPress }) => (
  <View className="gap-3 px-4">
    <View className="flex-row items-center justify-between">
      <Text className="font-semibold text-lg">Your Assets</Text>
      <Text className="text-muted-foreground text-sm">{formatVaultCount(vaults.length)}</Text>
    </View>
    {vaults.length > 0 ? (
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
    ) : (
      <EmptyState icon={WalletIcon} message="No vault positions yet. Deposit to get started." />
    )}
  </View>
);

export { AssetsSection };
