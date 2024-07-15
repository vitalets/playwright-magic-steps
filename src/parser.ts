/**
 * Parse a line of code.
 */

const stepOpener = /^\/\/\s+step:/;
const stepCloser = /^\/\/\s+(stepend|endstep)/;

export type ParsedLine = {
  index: number;
  indent: number;
  stepTitle: string;
  isCommented?: boolean;
  isStepStartComment?: boolean;
  isStepEndComment?: boolean;
};

export function parseLine(rawLine: string, index: number): ParsedLine {
  const line = rawLine.trim();
  const stepTitle = getStepTitle(line);
  return {
    index,
    indent: getIndent(rawLine),
    stepTitle,
    isStepStartComment: Boolean(stepTitle),
    isStepEndComment: stepCloser.test(line),
  };
}

export function getIndent(line: string) {
  const match = line.match(/^[ \t]*/);
  return match ? match[0].length : 0;
}

function getStepTitle(line: string) {
  const matches = line.split(stepOpener);
  return matches?.[1]?.trim() || '';
}

export function isCommented(line: string) {
  return line.trim().startsWith('//');
}
