/* components/TagMultiSelect.tsx ------------------------------------------- */
"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";      // if you already have a util; else inline classnames
import React from "react";

type Props = {
  title: string;
  accent: "purple" | "cyan";
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  max?: number;
};

export function TagMultiSelect({
  title,
  accent,
  options,
  selected,
  onToggle,
  max = 3,
}: Props) {
  /* pop-over open state (optional) */
  const [open, setOpen] = React.useState(false);

  const accentClass =
    accent === "purple"
      ? "accent-purple-500"
      : "accent-cyan-500";

  return (
    <div className="space-y-2">
      <label className="flex items-center justify-between text-sm font-medium">
        {title}
        <span className="text-xs text-muted-foreground">
          {selected.length}/{max}
        </span>
      </label>

      {/* chips + “+” button */}
      <div className="flex flex-wrap gap-1.5">
        {selected.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="flex items-center gap-1 bg-white/10 backdrop-blur-sm"
          >
            {tag}
            <Button
              size="icon"
              variant="ghost"
              className="h-4 w-4 p-0"
              onClick={() => onToggle(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {/* popover trigger */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className={`h-6 w-6 shrink-0 ${accentClass}`}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-60 bg-background/95 border-white/10 backdrop-blur-md p-0">
            <Command>
              <CommandInput placeholder="Search…" />
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup className="max-h-56 overflow-y-auto">
                {options.map((opt) => {
                  const disabled = !selected.includes(opt) && selected.length >= max;
                  return (
                    <CommandItem
                      key={opt}
                      disabled={disabled}
                      onSelect={() => {
                        if (!disabled) onToggle(opt);
                      }}
                      className={cn(
                        "cursor-pointer flex justify-between",
                        disabled && "opacity-40 pointer-events-none"
                      )}
                    >
                      {opt}
                      {selected.includes(opt) && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}