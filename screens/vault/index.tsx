import { Stack } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import useVaultScreen from "./hook";
import { formatTxHash } from "./util";

const VaultScreen = () => {
  const {
    vault,
    color,
    apy,
    shareBalanceNum,
    usdValue,
    assetBalance,
    isLoading,
    error,
    txHash,
    activeTab,
    depositAmount,
    withdrawAmount,
    setActiveTab,
    setDepositAmount,
    setWithdrawAmount,
    handleDeposit,
    handleWithdraw,
  } = useVaultScreen();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen options={{ title: vault.name }} />
      <ScrollView className="flex-1 bg-background" contentContainerClassName="p-4 pt-24 gap-6">
        <VaultHeader apy={apy} color={color} name={vault.name} symbol={vault.symbol} />
        <PositionCard
          assetBalance={assetBalance}
          assetSymbol={vault.asset.symbol}
          shareBalanceNum={shareBalanceNum}
          symbol={vault.symbol}
          usdValue={usdValue}
        />
        <ActionCard
          activeTab={activeTab}
          assetSymbol={vault.asset.symbol}
          depositAmount={depositAmount}
          isLoading={isLoading}
          onDeposit={handleDeposit}
          onDepositAmountChange={setDepositAmount}
          onTabChange={setActiveTab}
          onWithdraw={handleWithdraw}
          onWithdrawAmountChange={setWithdrawAmount}
          symbol={vault.symbol}
          withdrawAmount={withdrawAmount}
        />
        {error && <ErrorDisplay message={error} />}
        {txHash && <SuccessDisplay txHash={txHash} />}
        <VaultDetails address={vault.address} assetName={vault.asset.name} symbol={vault.symbol} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VaultScreen;

// Sub-components
type VaultHeaderProps = { symbol: string; name: string; apy: number; color: string };
const VaultHeader = ({ symbol, name, apy, color }: VaultHeaderProps) => (
  <View className="items-center gap-4 py-4">
    <View className="size-20 items-center justify-center rounded-full" style={{ backgroundColor: `${color}20` }}>
      <Text className="font-bold text-3xl" style={{ color }}>
        {symbol.charAt(0)}
      </Text>
    </View>
    <View className="items-center gap-1">
      <Text className="font-bold text-2xl">{name}</Text>
      <View className="rounded-full bg-green-500/10 px-3 py-1">
        <Text className="font-medium text-green-500 text-sm">{apy.toFixed(1)}% APY</Text>
      </View>
    </View>
  </View>
);

type PositionCardProps = {
  shareBalanceNum: number;
  symbol: string;
  usdValue: number;
  assetSymbol: string;
  assetBalance: string;
};
const PositionCard = ({ shareBalanceNum, symbol, usdValue, assetSymbol, assetBalance }: PositionCardProps) => (
  <View className="gap-4 rounded-2xl bg-card p-5">
    <Text className="font-semibold text-lg">Your Position</Text>
    <View className="gap-3 rounded-xl bg-muted/30 p-4">
      <InfoRow label="Vault Balance" value={`${shareBalanceNum.toFixed(4)} ${symbol}`} />
      <InfoRow label="USD Value" value={`$${usdValue.toFixed(2)}`} />
      <InfoRow label={`${assetSymbol} Available`} value={Number.parseFloat(assetBalance).toFixed(4)} />
    </View>
  </View>
);

type ActionCardProps = {
  activeTab: "deposit" | "withdraw";
  onTabChange: (tab: "deposit" | "withdraw") => void;
  depositAmount: string;
  withdrawAmount: string;
  onDepositAmountChange: (value: string) => void;
  onWithdrawAmountChange: (value: string) => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  isLoading: boolean;
  assetSymbol: string;
  symbol: string;
};
const ActionCard = (props: ActionCardProps) => (
  <View className="gap-4 rounded-2xl bg-card p-5">
    <View className="flex-row gap-2">
      <TabButton active={props.activeTab === "deposit"} label="Deposit" onPress={() => props.onTabChange("deposit")} />
      <TabButton
        active={props.activeTab === "withdraw"}
        label="Withdraw"
        onPress={() => props.onTabChange("withdraw")}
      />
    </View>
    {props.activeTab === "deposit" ? (
      <FormSection
        amount={props.depositAmount}
        isLoading={props.isLoading}
        label={props.assetSymbol}
        onAmountChange={props.onDepositAmountChange}
        onSubmit={props.onDeposit}
        submitLabel={`Deposit ${props.assetSymbol}`}
      />
    ) : (
      <FormSection
        amount={props.withdrawAmount}
        isLoading={props.isLoading}
        label={props.symbol}
        onAmountChange={props.onWithdrawAmountChange}
        onSubmit={props.onWithdraw}
        submitLabel={`Withdraw ${props.symbol}`}
      />
    )}
  </View>
);

type TabButtonProps = { label: string; active: boolean; onPress: () => void };
const TabButton = ({ label, active, onPress }: TabButtonProps) => (
  <Button
    accessibilityRole="tab"
    accessibilityState={{ selected: active }}
    className="flex-1"
    onPress={onPress}
    variant={active ? "default" : "outline"}
  >
    <Text>{label}</Text>
  </Button>
);

type FormSectionProps = {
  label: string;
  amount: string;
  onAmountChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  submitLabel: string;
};
const FormSection = ({ label, amount, onAmountChange, onSubmit, isLoading, submitLabel }: FormSectionProps) => (
  <View className="gap-4">
    <View className="gap-2">
      <Text className="text-muted-foreground text-sm">Amount ({label})</Text>
      <Input keyboardType="decimal-pad" onChangeText={onAmountChange} placeholder="0.00" value={amount} />
    </View>
    <Button accessibilityLabel={submitLabel} className="h-12" disabled={isLoading || !amount} onPress={onSubmit}>
      {isLoading ? <ActivityIndicator color="white" size="small" /> : <Text>{submitLabel}</Text>}
    </Button>
  </View>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <View className="rounded-xl bg-destructive/10 p-4">
    <Text className="text-center text-destructive text-sm">{message}</Text>
  </View>
);

const SuccessDisplay = ({ txHash }: { txHash: string }) => (
  <View className="rounded-xl bg-green-500/10 p-4">
    <Text className="text-center text-green-600 text-sm">Transaction successful!</Text>
    <Text className="mt-1 text-center font-mono text-green-600/70 text-xs">{formatTxHash(txHash)}</Text>
  </View>
);

type VaultDetailsProps = { assetName: string; symbol: string; address: string };
const VaultDetails = ({ assetName, symbol, address }: VaultDetailsProps) => (
  <View className="gap-3 rounded-2xl bg-card p-5">
    <Text className="font-semibold">Vault Details</Text>
    <View className="gap-2">
      <InfoRow label="Asset" value={assetName} />
      <InfoRow label="Symbol" value={symbol} />
      <InfoRow label="Network" value="Base" />
      <InfoRow label="Contract" value={`${address.slice(0, 6)}...${address.slice(-4)}`} />
    </View>
  </View>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row items-center justify-between py-1">
    <Text className="text-muted-foreground text-sm">{label}</Text>
    <Text className="font-medium text-sm">{value}</Text>
  </View>
);
