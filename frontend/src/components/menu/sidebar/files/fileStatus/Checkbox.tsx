import { Check } from "lucide-react";
import React from "react";

interface CheckboxProps{
  addFile: React.ChangeEventHandler<HTMLInputElement>
}

const Checkbox = ({addFile}:CheckboxProps) => {
  return (
    <div className="relative size-fit">
      <input
        className="peer z-1 size-5 appearance-none rounded-sm border border-[rgba(255,255,255,0.5)] checked:bg-[rgba(255,255,255,0.25)]"
        type="checkbox"
        name="check_file"
        defaultChecked
        onChange={addFile}
      />
      <Check className="pointer-events-none absolute inset-0.5 hidden size-4 peer-checked:block" />
    </div>
  );
};

export default Checkbox;
