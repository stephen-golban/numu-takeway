import { useAuth } from "@/providers/auth-provider";
import LockScreen from "@/screens/lock";

export default function Lock() {
  const { authenticate, isAuthenticating } = useAuth();

  return <LockScreen authenticate={authenticate} isAuthenticating={isAuthenticating} />;
}
