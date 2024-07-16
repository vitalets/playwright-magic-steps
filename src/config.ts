export type MagicStepsConfig = {
  enabled: boolean;
  stepOpener: RegExp;
  stepCloser: RegExp;
};

export const config: MagicStepsConfig = {
  enabled: true,
  stepOpener: /^\/\/\s+step:/,
  stepCloser: /^\/\/\s+(stepend|endstep)/,
};
