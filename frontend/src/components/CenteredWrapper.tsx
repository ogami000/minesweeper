import React from "react";

type Props = {
  children: React.ReactNode;
};

export const CenteredWrapper: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      {children}
    </div>
  );
};
