export const world = {
  pos: { x: 4, y: 6.6 },
  heading: 0,
  speed: 0,
  minutes: 7 * 60 + 20,
};

export function syncWorld(
  pos: { x: number; y: number },
  heading: number,
  speed: number,
  minutes?: number,
) {
  world.pos = pos;
  world.heading = heading;
  world.speed = speed;
  if (minutes != null) world.minutes = minutes;
}
