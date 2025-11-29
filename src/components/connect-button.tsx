import { useAccount, useAppKit } from "@reown/appkit-react-native";
import { usePathname, useRouter } from "expo-router";
import { Settings2Icon, WalletIcon } from "lucide-react-native";
import { Pressable } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

export function ConnectButton() {
  const { open } = useAppKit();
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected } = useAccount();

  const onPressAvatar = () => {
    if (pathname === "/settings") {
      return;
    }

    return router.push("/settings");
  };

  if (isConnected) {
    return (
      <Pressable onPress={onPressAvatar}>
        <Avatar alt="Connected Wallet">
          <AvatarImage src="" />
          <AvatarFallback>
            <Icon as={Settings2Icon} className="size-4 text-foreground" />
          </AvatarFallback>
        </Avatar>
      </Pressable>
    );
  }

  return (
    <Button className="rounded-full px-8" onPress={() => open({ view: "Connect" })} variant="default">
      <Icon as={WalletIcon} className="text-primary-foreground" />
      <Text>Connect Wallet</Text>
    </Button>
  );
}
