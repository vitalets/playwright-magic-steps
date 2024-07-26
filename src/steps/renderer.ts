/**
 * Renders code with steps.
 */
import { Step } from './builder';
import { isCommented } from './parser';

export class StepsRenderer {
  private lines: string[] = [];

  constructor(
    rawLines: string[],
    private steps: Step[],
  ) {
    this.lines = rawLines.slice();
  }

  render() {
    this.steps.forEach((step) => {
      this.renderStepStart(step);
      this.renderStepEnd(step);
    });

    return this.lines;
  }

  private renderStepStart({ start, indent, title }: Step) {
    title = title.replace(/`/g, '\\`');
    this.lines[start] =
      `${' '.repeat(indent)}await (await import("@playwright/test")).test.step(\`${title}\`, async () => {`;
  }

  private renderStepEnd({ end, indent, endByComment }: Step) {
    if (endByComment) {
      this.lines[end] = `${' '.repeat(indent)}});`;
    } else {
      const line = this.lines[end];
      this.lines[end] = isCommented(line)
        ? `${' '.repeat(indent)}}); ${line.trim()}`
        : `${line} });`;
    }
  }
}
