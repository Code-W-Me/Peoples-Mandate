"use client";

interface ToggleProps {
  onValue: string;
  offValue: string;
  isValue: boolean;
  onSetIsValue: (value: boolean) => void;
}

export default function Toggle({
  onValue,
  offValue,
  isValue,
  onSetIsValue,
}: ToggleProps) {
  return (
    <div className="flex w-full justify-end items-center space-x-3">
      <span className="text-2xl font-medium text-orange-700">
        {isValue ? onValue.toUpperCase() : offValue.toUpperCase()}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isValue}
        onClick={() => {
          onSetIsValue(!isValue);
        }}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
          isValue ? "bg-orange-600" : "bg-gray-300"
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isValue ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
