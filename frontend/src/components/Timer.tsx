type TimerProps = {
  time: number;
};

export const Timer = ({ time }: TimerProps) => {
  return <div>Time: {time}</div>;
};
