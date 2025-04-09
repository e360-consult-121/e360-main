// helpers/priority.ts
import { leadPriority } from "../types/enums/enums"

const getRandomPriority = (): leadPriority => {
  const priorities = [leadPriority.HIGH, leadPriority.MEDIUM, leadPriority.LOW];
  return priorities[Math.floor(Math.random() * priorities.length)];
};

export const getPortugalPriority = (data: any): leadPriority => {
  return getRandomPriority();
};

export const getDubaiPriority = (data: any): leadPriority => {
  return getRandomPriority();
};

export const getDomiGrenaPriority = (data: any): leadPriority => {
  return getRandomPriority();
};
