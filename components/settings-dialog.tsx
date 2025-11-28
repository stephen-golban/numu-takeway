import { SettingsIcon, ShieldCheckIcon } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Icon } from "./ui/icon";
import { Switch } from "./ui/switch";
import { Text } from "./ui/text";

function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const { isAuthEnabled, isSupported, setAuthEnabled } = useAuth();

  async function handleToggle() {
    const success = await setAuthEnabled(!isAuthEnabled);
    if (!success) {
      // User cancelled biometric prompt
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          accessibilityHint="Tap to open settings"
          accessibilityLabel="Settings"
          accessibilityRole="button"
          size="icon"
          variant="ghost"
        >
          <Icon as={SettingsIcon} className="size-5 text-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your app preferences</DialogDescription>
        </DialogHeader>
        <View className="gap-4 py-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center gap-3">
              <View className="size-10 items-center justify-center rounded-full bg-primary/10">
                <Icon as={ShieldCheckIcon} className="text-primary" size={20} />
              </View>
              <View className="flex-1">
                <Text className="font-medium">Biometric Lock</Text>
                <Text className="text-muted-foreground text-xs">
                  {isSupported ? "Require Face ID/Touch ID to open app" : "Not available on this device"}
                </Text>
              </View>
            </View>
            <Switch checked={isAuthEnabled} disabled={!isSupported} onCheckedChange={handleToggle} />
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
}

export { SettingsDialog };
