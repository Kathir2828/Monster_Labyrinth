import { useEffect, useState } from "react";
import Cell from './Cell.jsx';
import './HomePage.css';

function HomePage() {
  const [grid, setGrid] = useState([]);
  const [option, setOption] = useState([0, 0, 0, 0, 0]);// goblin, orc, wall, start, exit
  const [choice, setChoice] = useState(0);

  const createInitialGrid = () => {
    let row = 20;
    let column = 40;
    let initialGrid = [];
    for (let i = 0; i < row; i++) {
      let singleRow = [];
      for (let j = 0; j < column; j++) singleRow.push({
        i,
        j,
        option: [0, 0, 0, 0, 0]// goblin, orc, wall, start, exit
      });
      initialGrid.push(singleRow);
    }
    setGrid(initialGrid);
  };

  useEffect(() => {
    createInitialGrid();
  }, []);

  const pause = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const fetchDungeonSolution = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/escape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grid })
      });

      const copyGrid = grid.map(row => row.map(cell => ({ ...cell })));

      const data = await response.json();
      console.log("data : ", data);
      const escape = data.escape;
      const result = data.result;
      const path = data.path;
      // eslint-disable-next-line no-await-in-loop
      for (let it of result) {
        setGrid((prevGrid) => {
          const copy = prevGrid.map(row => row.map(cell => ({ ...cell })));
          copy[it.i][it.j].option = it.option;
          return copy;
        });

        await pause(30);
      }
      setGrid((prevGrid) => copyGrid);
      if (escape) {
        for (let it of path) {
          setGrid((prevGrid) => {
            const copy = prevGrid.map(row => row.map(cell => ({ ...cell })));
            copy[it.i][it.j].option = [0, 0, 0, 1, 0];
            return copy;
          });

          await pause(30);
        }
      }

    } catch (error) {
      console.error("Error fetching dungeon solution:", error);
    }
  };

  const clearGrid = () => {
    const copyGrid = grid.map(row => row.map(cell => ({ ...cell })));
    for (let row of copyGrid) {
      for (let cell of row) {
        cell.option = [0, 0, 0, 0, 0];
      }
    }
    setGrid(copyGrid);
  }

  const fetchRandomDungeon = async () => {
    try {
      const copyGrid = grid.map(row => row.map(cell => ({ ...cell })));
      for (let row of copyGrid) {
        for (let cell of row) {
          cell.option = [0, 0, 0, 0, 0];
        }
      }
      setGrid(copyGrid);

      const response = await fetch("http://localhost:3000/api/random", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grid: copyGrid })
      });
      const data = await response.json();
      console.log("Random Dungeon Result:", data);
      setGrid(prev => (data.grid));
    } catch (error) {
      console.error("Error fetching random dungeon:", error);
    }
  };

  return (
    <>
      <div>
        <button onClick={fetchRandomDungeon}>Randomize Dungeon</button>
        <button onClick={() => { setOption([1, 0, 0, 0, 0]) }}>Goblin</button>
        <button onClick={clearGrid}>Clear</button>
        <button onClick={() => { setOption([0, 0, 1, 0, 0]) }}>Wall</button>
        <button onClick={() => { setOption([0, 0, 0, 1, 0]) }}>Human</button>
        <button onClick={() => { setOption([0, 0, 0, 0, 1]) }}>Exit</button>
        <button onClick={fetchDungeonSolution}>Run</button>
      </div>
      <div className='dungeon-container'>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="dungeon-row">
            {row.map((cell, cellIndex) =>
              <Cell key={`${cellIndex}-${rowIndex}`} cell={cell} option={option} setGrid={setGrid} />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default HomePage;