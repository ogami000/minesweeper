import { useAuth } from "../context/AuthContext";
import { Hamburger } from "./Hamburger";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  const { nickname } = useAuth();

  return (
    <header className="bg-white shadow-md py-2 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">
        <Link to="/">マインスイーパー</Link>
      </h1>
      <div className="flex gap-2 items-center">
        {nickname && <span>{nickname} さん</span>}
        <Hamburger />
      </div>
    </header>
  );
};
