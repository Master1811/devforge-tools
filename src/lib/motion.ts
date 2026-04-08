export const motionEase = [0.16, 1, 0.3, 1] as const;

export const motionDurations = {
  fast: 0.2,
  normal: 0.45,
  slow: 0.7,
} as const;

export const revealTransition = {
  duration: motionDurations.normal,
  ease: motionEase,
} as const;
