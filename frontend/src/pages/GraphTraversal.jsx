import { useAsyncValue } from 'react-router-dom';
import './GraphTraversal.css';
import { useState, useEffect } from 'react';


const Cell = ({ cell, setGrid }) => {
  let extraClass = '';
  if (cell.option[2] === 1) extraClass += 'wall';
  else if (cell.option[0] === 1) extraClass += 'start';
  else if (cell.option[1] === 1) extraClass += 'end';

  return (
    <div className={`cell ${extraClass}`} onClick={() => {
      setGrid((prev) => {
        let copy = prev.map((row) => row.map((col) => ({ ...col, option: [...col.option] })));
        let currOption = copy[cell.i][cell.j].option
        if ((cell.i === 0 && cell.j === 0) || (cell.i === copy.length - 1 && cell.j === copy[0].length - 1)) {
          return prev;
        }
        if (currOption[2] === 1) currOption[2] = 0;
        else currOption[2] = 1;
        return copy;
      })
    }}>
    </div>

  );
}

function GraphTraversal() {
  const [grid, setGrid] = useState([]);

  const createInitialGrid = () => {
    const row = 20;
    const col = 40;
    let initalGrid = [];
    for (let i = 0; i < row; i++) {
      let arr = [];
      for (let j = 0; j < col; j++) {
        arr.push({
          i,
          j,
          option: [0, 0, 0] // start, end, wall
        })
      }
      initalGrid.push(arr);
    }
    initalGrid[0][0].option[0] = 1; // start is 0,0
    initalGrid[row - 1][col - 1].option[1] = 1; // end is r-1, c-1
    setGrid((prev) => initalGrid);
  }

  useEffect(() => {
    createInitialGrid();
  }, []);

  const pause = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const fetchRandomMaze = async () => {
    try {
      const response = await fetch("http://monster-labyrinth.onrender.com/api/random-maze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grid })
      });
      const data = await response.json();
      console.log("Random Maze Result:", data);
      setGrid(prev => (data.grid));
    } catch (error) {
      console.error("Error fetching random maze:", error);
    }
  }

  const startBfs = async () => {
    try {
      const gridCopy = grid.map((row) => row.map((cell) => { return { ...cell, option: [...cell.option] } }));
      const response = await fetch("http://monster-labyrinth.onrender.com/api/start-bfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ grid: gridCopy })
      });
      const data = await response.json();
      console.log(data);
      for (let i = 0; i < data.path.length; i++) {
        const curr = data.path[i];
        setGrid((prev) => {
          let copy = prev.map((row) => row.map((cell) => { return { ...cell, option: cell.option } }))
          copy[curr.i][curr.j].option[0] = 1;
          copy[curr.i][curr.j].option[2] = 0;
          return copy;
        });
        await pause(15);
      }
    }
    catch (err) {
      console.log(err);
    }
  }
       //monster-labyrinth.onrender.com
  const startDfs = async () => {
    try {
      const gridCopy = grid.map((row) => row.map((cell) => { return { ...cell, option: [...cell.option] } }));
      const response = await fetch("http://monster-labyrinth.onrender.com/api/start-dfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ grid: gridCopy })
      });
      const data = await response.json();
      console.log(data);
      for (let i = 0; i < data.path.length; i++) {
        const curr = data.path[i];
        setGrid((prev) => {
          let copy = prev.map((row) => row.map((cell) => { return { ...cell, option: cell.option } }))
          copy[curr.i][curr.j].option[0] = 1;
          copy[curr.i][curr.j].option[2] = 0;
          return copy;
        });
        await pause(50);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="toolbar">
        <button onClick={fetchRandomMaze}>Generate Maze</button>
        <button className='startBfs' onClick={startBfs}>Start Bfs</button>
        <button className='startDfs' onClick={startDfs}>Start Dfs</button>
      </div>
      <div className='Grid'>
        {grid.map((row, rowIndex) => {
          return (
            <div key={`${rowIndex}`} className={`row-${rowIndex}`}>
              {row.map((cell, colIndex) => {
                return (
                  <Cell cell={cell} className={`${colIndex}-${rowIndex}`} setGrid={setGrid} key={`${colIndex}-${rowIndex}`}></Cell>
                )
              })}
            </div>
          )
        })}
      </div>
    </>
  );
}

export default GraphTraversal