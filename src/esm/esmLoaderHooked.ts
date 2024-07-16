import { transformMagicSteps } from '../steps';
import { hookTransform } from '../hook';

// @ts-expect-error no types for esmLoader
export * from 'playwright/lib/transform/esmLoader';

hookTransform(transformMagicSteps);
