import { transformMagicSteps } from '../../steps';
import { hookTransform } from '..';

hookTransform(transformMagicSteps);

// @ts-expect-error no types for esmLoader
export * from 'playwright/lib/transform/esmLoader';
