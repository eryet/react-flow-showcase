import { ChangeEventHandler, HTMLInputTypeAttribute } from "react";
import { input } from "../nodes/ProductInfoNode";

type InputFieldProps = {
  label: string;
  value?: input;
  type?: HTMLInputTypeAttribute;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  prefix?: string;
  subfix?: string;
  className?: string;
  [key: string]: unknown;
};

const InputField = ({
  label,
  value,
  type,
  onChange,
  prefix = "",
  subfix = "",
  className = "",
  ...props
}: InputFieldProps) => {
  return (
    <div className='mb-2'>
      <label className='block text-gray-700 text-sm font-bold mb-1'>
        {label}
      </label>
      <div className='flex items-center'>
        {prefix && <span className='mr-2'>{prefix}</span>}
        <input
          value={value ?? ""}
          onChange={onChange}
          type={type}
          className={`w-full p-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
          {...props}
        />
        {subfix && <span className='ml-2'>{subfix}</span>}
      </div>
    </div>
  );
};

export default InputField;
