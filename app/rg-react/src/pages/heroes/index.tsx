import { useNavigate } from "react-router-dom";

const Heroes = () => {
  const navigate = useNavigate();
  return (
    <div>
      heroes
      <button onClick={() => {
        navigate('/game');
      }}>OK</button>
    </div>
  );
};

export default Heroes;