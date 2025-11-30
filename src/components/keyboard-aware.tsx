import { KeyboardAwareScrollView, type KeyboardAwareScrollViewProps } from "react-native-keyboard-controller";
import { cn } from "@/lib/utils";

interface IKeyboardAwareProps extends KeyboardAwareScrollViewProps {}

const KeyboardAware: React.FC<IKeyboardAwareProps> = ({
  children,
  className,
  contentContainerClassName,
  bottomOffset = 200,
  ...props
}) => (
  <KeyboardAwareScrollView
    {...props}
    bottomOffset={bottomOffset}
    className={cn("flex-1 bg-background", className)}
    contentContainerClassName={cn("flex-grow", contentContainerClassName)}
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
  >
    {children}
  </KeyboardAwareScrollView>
);

export { KeyboardAware };
