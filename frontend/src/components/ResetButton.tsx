type ResetButtonProps = { onReset: () => void };

export const ResetButton = ({ onReset }: ResetButtonProps) => {
  return (
    <button
      type="button"
      onClick={onReset}
      className="text-white bg-gray-800 hover:bg-gray-600 rounded-full text-sm px-5 py-2 cursor-pointer"
    >
      Reset
    </button>
  );
};
