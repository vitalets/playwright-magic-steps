import { config, MagicStepsConfig } from './config';
import { hookPirates } from './hook';
import { transformMagicSteps } from './steps';

export function magicSteps(userConfig?: Partial<MagicStepsConfig>) {
  Object.assign(config, userConfig);
  if (config.enabled) {
    // hook pirates for cjs projects
    hookPirates(transformMagicSteps);
  }
}
