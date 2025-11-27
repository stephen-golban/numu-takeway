import { useAuth } from "@/providers/auth-provider";
import LockScreen from "@/screens/lock";

export default function Lock() {
  const { authenticate, lockCount } = useAuth();
  return <LockScreen key={lockCount} onUnlock={authenticate} />;
}
