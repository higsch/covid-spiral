export const getPositionFromDistanceAndAngle = (distance, angle) => {
  const x = distance * Math.cos((angle * Math.PI) / 180);
  const y = distance * Math.sin((angle * Math.PI) / 180);
  return { x, y };
};

const pathToArray = path =>  path.split(/(?=[a-zA-Z])/g);

const stripFirst = path => {
  const arr = pathToArray(path);
  return arr.slice(1).join('');
};

export const fusePaths = (path1, path2) => {
  const path2WithoutM = stripFirst(path2);
  const fused = `${path1}${path2WithoutM}Z`;
  return fused;
};