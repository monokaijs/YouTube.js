const fs = require('fs');

const meta = JSON.parse(fs.readFileSync('./bundle/react-native-meta.json', 'utf8'));

console.log('\n=== Bundle Analysis ===\n');

// Output info
const output = Object.values(meta.outputs)[0];
console.log(`Total bundle size: ${(output.bytes / 1024).toFixed(2)} KB`);
console.log(`Total inputs: ${Object.keys(meta.inputs).length}`);

// Top 20 largest inputs
console.log('\n=== Top 20 Largest Input Files ===\n');
const inputs = Object.entries(meta.inputs)
  .map(([path, data]) => ({ path, bytes: data.bytes }))
  .sort((a, b) => b.bytes - a.bytes)
  .slice(0, 20);

inputs.forEach((input, i) => {
  const sizeKB = (input.bytes / 1024).toFixed(2);
  const percentage = ((input.bytes / output.bytes) * 100).toFixed(2);
  console.log(`${i + 1}. ${sizeKB} KB (${percentage}%) - ${input.path.replace(/\\/g, '/')}`);
});

// Analyze by directory
console.log('\n=== Size by Directory ===\n');
const dirSizes = {};
Object.entries(meta.inputs).forEach(([path, data]) => {
  const parts = path.split(/[\/\\]/);
  const dir = parts.slice(0, -1).join('/') || 'root';
  dirSizes[dir] = (dirSizes[dir] || 0) + data.bytes;
});

const topDirs = Object.entries(dirSizes)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

topDirs.forEach(([dir, bytes]) => {
  const sizeKB = (bytes / 1024).toFixed(2);
  const percentage = ((bytes / output.bytes) * 100).toFixed(2);
  console.log(`${sizeKB} KB (${percentage}%) - ${dir}`);
});

console.log('\n');

