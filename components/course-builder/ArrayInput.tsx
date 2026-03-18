"use client";

import { useFieldArray, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPlus, IconTrash } from "@tabler/icons-react";

interface ArrayInputProps {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  description?: string;
}

export function ArrayInput({
  name,
  control,
  label,
  placeholder = "Add item...",
  description,
}: ArrayInputProps) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
          {label}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              {...control.register(`${name}.${index}`)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="shrink-0 text-muted-foreground hover:text-destructive h-9 w-9"
            >
              <IconTrash size={16} />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
        className="gap-2 text-xs font-semibold"
      >
        <IconPlus size={14} />
        Add {label}
      </Button>
    </div>
  );
}
