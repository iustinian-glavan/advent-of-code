const fs = require('fs');

function distance(p1, p2) {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
    Math.pow(p2.y - p1.y, 2) +
    Math.pow(p2.z - p1.z, 2)
  );
}

function find(parent, i) {
  if (parent[i] === i) {
    return i;
  }
  return parent[i] = find(parent, parent[i]);
}

function union(parent, rank, i, j) {
  const root_i = find(parent, i);
  const root_j = find(parent, j);

  if (root_i !== root_j) {
    if (rank[root_i] > rank[root_j]) {
      parent[root_j] = root_i;
    } else if (rank[root_i] < rank[root_j]) {
      parent[root_i] = root_j;
    } else {
      parent[root_j] = root_i;
      rank[root_i]++;
    }
    return true; // Union was successful
  }
  return false; // Union was not successful
}

function solve(inputFile) {
  const input = fs.readFileSync(inputFile, 'utf8').trim().split('\n');
  const points = input.map(line => {
    const [x, y, z] = line.split(',').map(Number);
    return { x, y, z };
  });

  const distances = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      distances.push({
        p1: i,
        p2: j,
        dist: distance(points[i], points[j])
      });
    }
  }

  distances.sort((a, b) => a.dist - b.dist);

  const parent = Array.from({ length: points.length }, (_, i) => i);
  const rank = Array(points.length).fill(0);
  let numSets = points.length;

  for (const edge of distances) {
    if (union(parent, rank, edge.p1, edge.p2)) {
      numSets--;
      if (numSets === 1) {
        const point1 = points[edge.p1];
        const point2 = points[edge.p2];
        console.log(point1.x * point2.x);
        return;
      }
    }
  }
}

solve('input.txt');
