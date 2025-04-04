type TimerProps = {
  time: number;
};

export const Timer = ({ time }: TimerProps) => {
  return <span className="w-20">Time: {time}</span>;
};
