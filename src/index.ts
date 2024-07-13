import path from 'node:path';

installMagicSteps();

function installMagicSteps() {
  const pwRoot = resolvePackageRoot('playwright');
  const babelBundle = require(`${pwRoot}/lib/transform/babelBundle.js`);
  const orig = babelBundle.babelTransform;
  babelBundle.babelTransform = (originalCode: string, ...args: unknown[]) => {
    const code = transformMagicSteps(originalCode);
    // console.log(code);
    return orig.call(babelBundle, code, ...args);
  };
}

type Step = {
  title: string;
  indent: number;
  start: number;
  end: number;
  explicitEnd?: boolean;
};

// eslint-disable-next-line max-statements, complexity, max-statements
export function transformMagicSteps(code: string) {
  const steps: Step[] = [];
  const stack: Step[] = [];
  const lines = code.split('\n');

  // eslint-disable-next-line max-statements, complexity, max-statements
  lines.forEach((rawLine, index) => {
    const indent = getIndent(rawLine);
    const line = rawLine.trim();
    let lastOpenStep: Step | undefined = stack[stack.length - 1];

    // step end by indent (close all steps where step.indent > indent)
    while (lastOpenStep?.indent > indent) {
      lastOpenStep.end = index - 1;
      steps.push(lastOpenStep);
      stack.pop();
      lastOpenStep = stack[stack.length - 1];
    }

    // step end by explicit comment
    if (isExplicitStepEnd(line)) {
      if (!lastOpenStep) throw new Error(`Step end without step start`);
      if (indent !== lastOpenStep.indent)
        throw new Error(`Invalid indent for stepend`);
      lastOpenStep.end = index - 1;
      lastOpenStep.explicitEnd = true;
      steps.push(stack.pop()!);
      return;
    }

    // is step start
    const stepTitle = line.split('// step:')[1]?.trim();
    if (stepTitle) {
      // close prev step
      if (lastOpenStep && lastOpenStep.indent === indent) {
        lastOpenStep.end = index - 1;
        steps.push(stack.pop()!);
      }

      const step: Step = {
        title: stepTitle,
        start: index,
        end: 0,
        indent,
      };

      stack.push(step);
    }
  });

  if (stack.length) {
    // close all open steps
    let lastOpenStep: Step | undefined = stack[stack.length - 1];
    while (lastOpenStep?.indent > 0) {
      lastOpenStep.end = lines.length - 1;
      steps.push(lastOpenStep);
      stack.pop();
      lastOpenStep = stack[stack.length - 1];
    }
  }

  steps.forEach((step) => {
    const title = step.title.replace(/`/g, '\\`');
    lines[step.start] =
      `${' '.repeat(step.indent)}await test.step(\`${title}\`, async () => {`;
    lines[step.end] = isComment(lines[step.end])
      ? `${' '.repeat(step.indent)}}); ${lines[step.end].trim()}`
      : `${lines[step.end]} });`;
    if (step.explicitEnd) lines[step.end + 1] = ''; // clear stepend
  });

  return lines.join('\n');
}

function getIndent(str: string) {
  const match = str.match(/^[ \t]*/);
  return match ? match[0].length : 0;
}

function resolvePackageRoot(packageName: string) {
  const packageJsonPath = require.resolve(`${packageName}/package.json`);
  return path.dirname(packageJsonPath);
}

function isComment(line: string) {
  return line.trim().startsWith('//');
}

function isExplicitStepEnd(line: string) {
  return /^\/\/\s+(stepend|endstep)/.test(line);
}
