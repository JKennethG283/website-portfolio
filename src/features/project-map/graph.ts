export type Point3 = { x: number; y: number; z: number };

export function spherePoint(index: number, count: number): Point3 {
  const y = 1 - ((index + 0.5) / count) * 2;
  const radius = Math.sqrt(1 - y * y);
  const angle = index * Math.PI * (3 - Math.sqrt(5));
  return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
}

export function projectPoint(
  point: Point3,
  yaw: number,
  tilt: number,
  radius: number,
  width: number,
  height: number,
) {
  const x = point.x * Math.cos(yaw) + point.z * Math.sin(yaw);
  const depth = -point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
  const y = point.y * Math.cos(tilt) - depth * Math.sin(tilt);
  const z = point.y * Math.sin(tilt) + depth * Math.cos(tilt);
  const perspective = 3.6 / (3.6 - z);
  return {
    x: width / 2 + x * radius * perspective,
    y: height / 2 + y * radius * perspective,
    z,
    scale: perspective,
  };
}
