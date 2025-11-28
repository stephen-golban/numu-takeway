import { ActivityIndicator, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import type { ActiveTab } from "../type";

type ActionFormProps = {
  label: string;
  amount: string;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  submitLabel: string;
  validationError?: string | null;
  isValid: boolean;
};

function ActionForm({
  label,
  amount,
  onAmountChange,
  onSubmit,
  isLoading,
  submitLabel,
  validationError,
  isValid,
}: ActionFormProps) {
  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-muted-foreground text-sm">Amount ({label})</Text>
        <Input keyboardType="decimal-pad" onChangeText={onAmountChange} placeholder="0.00" value={amount} />
        {validationError && <Text className="text-destructive text-xs">{validationError}</Text>}
      </View>
      <Button accessibilityLabel={submitLabel} className="h-12" disabled={isLoading || !isValid} onPress={onSubmit}>
        {isLoading ? <ActivityIndicator color="white" size="small" /> : <Text>{submitLabel}</Text>}
      </Button>
    </View>
  );
}

type ActionConfig = {
  amount: string;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
  symbol: string;
  validationError?: string | null;
  isValid: boolean;
};

type ActionCardProps = {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  deposit: ActionConfig;
  withdraw: ActionConfig;
  isLoading: boolean;
};

function ActionCard({ activeTab, onTabChange, deposit, withdraw, isLoading }: ActionCardProps) {
  const config = activeTab === "deposit" ? deposit : withdraw;
  const action = activeTab === "deposit" ? "Deposit" : "Withdraw";

  return (
    <Card className="border-0">
      <CardHeader className="pb-0">
        <Tabs onValueChange={(value) => onTabChange(value as ActiveTab)} value={activeTab}>
          <TabsList className="w-full">
            <TabsTrigger className="flex-1" value="deposit">
              <Text>Deposit</Text>
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="withdraw">
              <Text>Withdraw</Text>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ActionForm
          amount={config.amount}
          isLoading={isLoading}
          isValid={config.isValid}
          label={config.symbol}
          onAmountChange={config.onAmountChange}
          onSubmit={config.onSubmit}
          submitLabel={`${action} ${config.symbol}`}
          validationError={config.validationError}
        />
      </CardContent>
    </Card>
  );
}

function ActionCardSkeleton() {
  return (
    <Card className="border-0">
      <CardHeader className="pb-0">
        <Skeleton className="h-9 w-full rounded-lg bg-muted" />
      </CardHeader>
      <CardContent>
        <View className="gap-4">
          <View className="gap-2">
            <Skeleton className="h-4 w-24 bg-muted" />
            <Skeleton className="h-12 w-full rounded-md bg-muted" />
          </View>
          <Skeleton className="h-12 w-full rounded-md bg-muted" />
        </View>
      </CardContent>
    </Card>
  );
}

export { ActionCard, ActionCardSkeleton, ActionForm };
export type { ActionCardProps, ActionConfig, ActionFormProps };
