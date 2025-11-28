import { Stack } from "expo-router";
import { NetworkBadge } from "@/components/ui/network-badge";
import { useHeaderOptions } from "@/lib/use-header-options";
import WelcomeScreen from "@/screens/welcome";

export default function Welcome() {
  const headerOptions = useHeaderOptions("Welcome");

  return (
    <>
      <Stack.Screen
        options={{
          ...headerOptions,
          headerLeft: () => <NetworkBadge isConnected={false} name="Base" />,
        }}
      />
      <WelcomeScreen />
    </>
  );
}
