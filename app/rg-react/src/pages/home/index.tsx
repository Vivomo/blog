import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => {
        navigate('/heroes')
      }}>Start</button>
    </div>
  );
};

export default Home;