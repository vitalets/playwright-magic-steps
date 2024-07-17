/**
 * Builds steps for file.
 */
import { ParsedLine, parseLine } from './parser';

export type Step = {
  title: string;
  indent: number;
  start: number;
  end: number;
  endByComment?: boolean;
};

export class StepsBuilder {
  private steps: Step[] = [];

  constructor(
    private rawLines: string[],
    private filename: string,
  ) {}

  private get openSteps() {
    return this.steps.filter((step) => !step.end);
  }

  build() {
    this.rawLines.forEach((rawLine, index) => this.processLine(rawLine, index));
    this.closeStepsByFileEnd();

    return this.steps;
  }

  private processLine(rawLine: string, index: number) {
    const line = parseLine(rawLine, index);
    this.closeStepsByIndent(line);

    if (line.isStepEndComment) {
      this.closeStepByEndComment(line);
      return;
    }

    if (line.isStepStartComment) {
      this.closeStepByStartComment(line);
      this.openStep(line);
    }
  }

  private closeStepsByIndent(line: ParsedLine) {
    this.openSteps.forEach((step) => {
      if (step.indent > line.indent) step.end = line.index - 1;
    });
  }

  private closeStepsByFileEnd() {
    const fakeLine: ParsedLine = {
      index: this.rawLines.length,
      indent: 0,
      stepTitle: '',
    };
    this.closeStepsByIndent(fakeLine);
  }

  private closeStepByEndComment(line: ParsedLine) {
    const stepsToClose = this.openSteps.filter(
      (step) => step.indent === line.indent,
    );
    if (stepsToClose.length === 0) {
      this.throwError(line, `Step end without step start`);
    }
    if (stepsToClose.length > 1) {
      this.throwError(line, `Several open steps with same indent.`);
    }
    stepsToClose[0].end = line.index;
    stepsToClose[0].endByComment = true;
  }

  private closeStepByStartComment(line: ParsedLine) {
    const stepsToClose = this.openSteps.filter(
      (step) => step.indent === line.indent,
    );
    if (stepsToClose.length > 1) {
      this.throwError(line, `Several open steps with same indent.`);
    }
    if (stepsToClose.length === 1) {
      stepsToClose[0].end = line.index - 1;
    }
  }

  private openStep({ index, indent, stepTitle }: ParsedLine) {
    this.steps.push({
      title: stepTitle,
      indent,
      start: index,
      end: 0,
    });
  }

  private throwError(line: ParsedLine, msg: string): never {
    const error = new Error(msg);
    // change error.stack for pw to render pretty snippet
    error.stack = [
      `Error: ${msg}`,
      `    at <unknown> (${this.filename}:${line.index + 1}:0)`,
      ``,
    ].join('\n');
    throw error;
  }
}
