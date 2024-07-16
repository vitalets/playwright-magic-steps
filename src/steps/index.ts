import { StepsBuilder } from './builder';
import { StepsRenderer } from './renderer';

export function transformMagicSteps(code: string, filename = '') {
  const rawLines = code.split('\n');
  const steps = new StepsBuilder(rawLines, filename).build();
  const lines = new StepsRenderer(rawLines, steps).render();
  return lines.join('\n');
}
