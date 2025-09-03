import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useId } from "react";

interface Props {
  value: string;
  onChange: (themeId: string) => void;
}

const THEMES = [
  { id: "theme-default", label: "Default" },
  { id: "theme-dark", label: "Dark" },
  { id: "theme-fusion", label: "Fusion" },
  { id: "theme-ocean", label: "Ocean" },
  { id: "theme-green", label: "Green" },
  { id: "theme-light-blue", label: "Light Blue" },
];

export const ThemePicker = ({ value, onChange }: Props) => {
  const triggerId = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={triggerId}>Theme</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={triggerId} className="w-full">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {THEMES.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              {theme.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};


