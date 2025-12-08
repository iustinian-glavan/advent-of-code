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
  }
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

  for (let i = 0; i < 1000; i++) {
    union(parent, rank, distances[i].p1, distances[i].p2);
  }

  const circuitSizes = {};
  for (let i = 0; i < points.length; i++) {
    const root = find(parent, i);
    circuitSizes[root] = (circuitSizes[root] || 0) + 1;
  }

  const sortedSizes = Object.values(circuitSizes).sort((a, b) => b - a);
  const result = sortedSizes.slice(0, 3).reduce((acc, size) => acc * size, 1);

  console.log(result);
}

solve('input.txt');
