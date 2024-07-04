import React from "react";

type Props = {
    onChange?:(checked:boolean) => void
    checked?: boolean;
    id?: string,
    disabled?:boolean
};

const Switch = (props: Props) => {
  const {checked, onChange, id = "", disabled} = props
  return (
    <div className="flex items-center justify-center w-fit ">
      <label htmlFor={`toggleB${id}`} className="flex items-center cursor-pointer">
        <div className="relative">
          <input disabled={disabled} type="checkbox" id={`toggleB${id}`} checked={checked} onChange={(e) => onChange && onChange(e.target.checked)} className="sr-only" />
          <div className={`block ${!checked? "bg-gray-500" : "bg-green-600"} w-14 h-8 rounded-full`}></div>
          <div className={`${!checked? "translate-x-[0%]" : "translate-x-[100%]"} absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition`}></div>
        </div>
      </label>
    </div>
  );
};

export default Switch;
