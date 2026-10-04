import './HomePage.css';
import { useNavigate } from 'react-router-dom';

function HomePage() {

  const navigate = useNavigate();

  return (
    <div className='container'>
      <div className='option' onClick={() => { navigate('/dungeon') }}>
        Dungeon Escape Visualizer
      </div>
      <div className='option' onClick={() => { navigate('/graph-traversal') }}>
        Bfs Vs Dfs Path Finding Visualizer
      </div>
    </div>

  );
}

export default HomePage;