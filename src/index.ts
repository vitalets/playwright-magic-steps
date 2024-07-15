import { StepsBuilder } from './builder';
import { hookPirates } from './hook';
import { StepsRenderer } from './renderer';

installMagicSteps();

function installMagicSteps() {
  // hookBabelTransform(transformMagicSteps);
  hookPirates(transformMagicSteps);
}

export function transformMagicSteps(code: string, filename = '') {
  const rawLines = code.split('\n');
  const steps = new StepsBuilder(rawLines, filename).build();
  const lines = new StepsRenderer(rawLines, steps).render();
  return lines.join('\n');
}
