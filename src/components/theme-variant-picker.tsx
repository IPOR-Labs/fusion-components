import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useId } from "react";

export type ThemeVariant = "light" | "dark";

interface Props {
  value: ThemeVariant;
  onChange: (mode: ThemeVariant) => void;
}

export const ThemeVariantPicker = ({ value, onChange }: Props) => {
  const triggerId = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={triggerId}>Theme Variant</Label>
      <Select value={value} onValueChange={(v) => onChange(v as ThemeVariant) }>
        <SelectTrigger id={triggerId} className="w-full">
          <SelectValue placeholder="Theme Variant" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};


