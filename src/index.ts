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

export function transformMagicSteps(code: string) {
  const steps: Step[] = [];
  const stack: Step[] = [];
  const lines = code.split('\n');
  // eslint-disable-next-line max-statements, complexity
  lines.forEach((line, index) => {
    const indent = getIndent(line);
    const lastOpenStep = stack[stack.length - 1];

    // is step start
    const stepTitle = line.split('// step:')[1]?.trim();

    if (stepTitle) {
      // close prev step
      if (lastOpenStep && lastOpenStep.indent === indent) {
        // todo: check indent
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
      return;
    }

    // is step end
    if (lastOpenStep) {
      // todo: check invalid indent
      // todo: handle step end without step start
      if (line.includes('// stepend') || line.includes('// endstep')) {
        lastOpenStep.end = index - 1;
        lastOpenStep.explicitEnd = true;
        steps.push(stack.pop()!);
        return;
      }

      if (indent < lastOpenStep.indent) {
        lastOpenStep.end = index - 1;
        steps.push(stack.pop()!);
        return;
      }
    }
  });

  if (stack.length) {
    throw new Error(`Unclosed steps!`);
  }

  steps.forEach((step) => {
    const title = step.title.replace(/`/g, '\\`');
    lines[step.start] =
      `${' '.repeat(step.indent)}await test.step(\`${title}\`, async () => {`;
    lines[step.end] = `${lines[step.end]} });`;
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
