import { Stack } from "expo-router";
import { createHeaderConfig } from "@/components/header";
import { useCustomColorScheme } from "@/hooks/use-custom-color-scheme";
import WelcomeScreen from "@/screens/welcome";

export default function Welcome() {
  const { isDark } = useCustomColorScheme();
  const headerOptions = createHeaderConfig({ title: "Welcome", isDark, isConnected: false });

  return (
    <>
      <Stack.Screen options={headerOptions} />
      <WelcomeScreen />
    </>
  );
}
