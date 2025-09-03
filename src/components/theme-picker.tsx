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
  { id: "theme-blue", label: "Blue" },
  { id: "theme-bubblegum", label: "Bubblegum" },
  { id: "theme-caffeine", label: "Caffeine" },
  { id: "theme-default", label: "Default" },
  { id: "theme-fusion", label: "Fusion" },
  { id: "theme-green", label: "Green" },
  { id: "theme-neo-brutalism", label: "Neo Brutalism" },
  { id: "theme-orange", label: "Orange" },
  { id: "theme-retro-arcade", label: "Retro Arcade" },
  { id: "theme-twitter", label: "Twitter" },
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


