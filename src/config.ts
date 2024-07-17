type MagicStepsConfig = {
  stepOpener: RegExp;
  stepCloser: RegExp;
};

export const config: MagicStepsConfig = {
  stepOpener: /^\/\/\s+step:/,
  stepCloser: /^\/\/\s+(stepend|endstep)/,
};
