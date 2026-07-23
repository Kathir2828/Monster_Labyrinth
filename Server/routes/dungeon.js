import express from 'express';

const router = express.Router();

router.post("/random", (req, res) => {
  let { grid } = req.body;


  const row = grid.length;
  const col = grid[0].length;
  let human = true;

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      const val = Math.random() * 101;
      // 0 - 10 goblin, 11- 15 orc, 16 - 70 wall, 71 - 80 human, 81 - 100 exit
      if (val <= 1) grid[i][j].option[0] = 1; // goblin
      else if (val <= 2) grid[i][j].option[4] = 1; // exit
      else if (val <= 15) grid[i][j].option[2] = 1; // wall
      else if (val <= 80) continue;
      else if (human) human = false, grid[i][j].option[3] = 1;
    }
  }
  return res.json({
    grid
  });
});

router.post("/escape", (req, res) => {
  const { grid } = req.body;

  if (!grid || !grid.length || !grid[0].length) {
    return res.status(400).json({ error: "Invalid grid input" });
  }

  const rows = grid.length;
  const cols = grid[0].length;

  const human = [];
  const monsters = [];
  const exits = [];

  // result to send back
  const result = [];
  const path = [];
  let escape = false;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = grid[i][j];

      if (cell.option[3] === 1) {
        human.push({ i, j });
      }
      else if (cell.option[0] === 1 || cell.option[1] === 1) {
        monsters.push({ i, j });
      }
      else if (cell.option[4] === 1) {
        exits.push({ i, j });
      }
    }
  }

  if (human.length === 0 || exits.length === 0) {
    return res.json({ error: "No start position or endint position set on the grid." });
  }

  const visited = Array.from({ length: rows }, () => Array(cols).fill(0));
  const direction = Array.from({ length: rows }, () => Array(cols).fill(-1));

  for (const m of monsters) {
    visited[m.i][m.j] = 1;
  }
  visited[human[0].i][human[0].j] = 1;
  let q2 = [...human];
  let q1 = [...monsters];
  let steps = 0;
  const dirs = [
    [-1, 0], // Up: row - 1, col + 0
    [1, 0],  // Down: row + 1, col + 0
    [0, -1], // Left: row + 0, col - 1
    [0, 1]   // Right: row + 0, col + 1
  ];

  let monsterMove = 0;

  while (q1.length > 0 || q2.length > 0) {
    const sz1 = q1.length; // monster 
    const sz2 = q2.length; // human
    let nextQ1 = [];
    let nextQ2 = [];
    let found = false;

    monsterMove++;
    if (monsterMove % 2 == 1) { // monsters turn to move
      for (let k = 0; k < sz1; k++) { // monsters
        const curr = q1[k];

        for (const [di, dj] of dirs) {
          const ni = curr.i + di;
          const nj = curr.j + dj;

          if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && !visited[ni][nj] && !grid[ni][nj].option[2] && !grid[ni][nj].option[4]) { // cant visit wall and exit
            visited[ni][nj] = 1;
            nextQ1.push({ i: ni, j: nj });
            result.push({ i: ni, j: nj, option: [1, 0, 0, 0, 0] });
          }
        }
      }
    }
    else nextQ1 = [...q1];

    for (let k = 0; k < sz2; k++) { // humans
      const curr = q2[k];
      for (let move = 0; move < 4; move++) {
        const ni = curr.i + dirs[move][0];
        const nj = curr.j + dirs[move][1];

        if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && !visited[ni][nj] && !grid[ni][nj].option[2]) { // cant visit wall 
          visited[ni][nj] = 1;
          nextQ2.push({ i: ni, j: nj });
          result.push({ i: ni, j: nj, option: [0, 0, 0, 1, 0] });
          direction[ni][nj] = move;
          if (grid[ni][nj].option[4] === 1) {
            found = true;
            break;
          }
        }
      }
      if (found) break;
    }

    q1 = [...nextQ1];
    q2 = [...nextQ2];
    steps++;
    if (found) break;
  }

  for (const exit of exits) {
    if (direction[exit.i][exit.j] != -1) {
      // trace back the path here
      let x = exit.i, y = exit.j;
      escape = true;

      while (direction[x][y] != -1) {
        const move = direction[x][y];
        x -= dirs[move][0];
        y -= dirs[move][1];
        path.push({ i: x, j: y });
      }
      break;
    }
  }

  const pathRev = path.reverse();

  return res.json({
    escape,
    result,
    path: pathRev
  });
});


export default router;