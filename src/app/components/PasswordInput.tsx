import { useId, useState, type ComponentProps } from "react";
import { Eye, EyeOff, Lock as LockIcon } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "./ui/utils";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type"> & {
  /** Visible label text; also used for the show/hide button when `label` is omitted. */
  visibilityLabel?: string;
  showLockIcon?: boolean;
};

/**
 * Password field with show/hide toggle (eye icon) for accessibility and typo checking.
 */
export function PasswordInput({
  id: idProp,
  className,
  visibilityLabel = "Password",
  showLockIcon = true,
  ...props
}: PasswordInputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {showLockIcon && (
        <LockIcon
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none"
          aria-hidden
        />
      )}
      <Input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={props.autoComplete ?? "current-password"}
        className={cn(showLockIcon && "pl-10 pr-10", !showLockIcon && "pr-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-1 rounded-sm"
        aria-label={visible ? `Hide ${visibilityLabel}` : `Show ${visibilityLabel}`}
        aria-pressed={visible}
        aria-controls={id}
      >
        {visible ? (
          <EyeOff className="h-5 w-5" aria-hidden />
        ) : (
          <Eye className="h-5 w-5" aria-hidden />
        )}
      </button>
    </div>
  );
}
