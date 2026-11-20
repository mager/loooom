export interface GymCase {
  id: string;
  title: string;
  split: 'train' | 'holdout';
  prompt: string;
  criteria: string[];
}
export interface Suite {
  id: string;
  strategy: 'repair' | 'ablate';
  skillName?: string;
  title?: string;
  description?: string;
  version?: number;
  sourceUrl?: string;
  cases: GymCase[];
}
export interface Check { criterion: string; pass: boolean; reason: string }
export interface Sample {
  id: string;
  caseId: string;
  repetition: number;
  response: string;
  elapsedMs: number;
  passed?: boolean;
  checks?: Check[];
}
export interface Version { hash: string; words: number; bytes: number; content: string }
export interface Score {
  passed: number;
  total: number;
  rate: number;
  byCase: Record<string, {passed: number; total: number}>;
  /** Descriptive Wilson interval. Repeated model samples need not be independent. */
  interval: [number, number];
}
export interface Evaluation extends Version { samples: Sample[]; score: Score }
export interface Decision {
  accepted: boolean;
  fixed: string[];
  regressions: string[];
  wordsRemoved: number;
  reductionPercent: number;
  reason: string;
}
export interface Adapter {
  name?: string;
  version?: string;
  cliVersion?: string;
  model?: string;
  complete(prompt: string, schema: Record<string, unknown>, label: string, options?: {signal?: AbortSignal}): Promise<{data: unknown; elapsedMs?: number}>;
}
export interface Round {
  index: number;
  parentHash: string;
  status: 'proposing' | 'evaluating' | 'duplicate' | 'accepted' | 'rejected';
  candidate: ((Version | Evaluation) & {rationale: string}) | null;
  decision: Decision | null;
}
export interface Session {
  schemaVersion: 2;
  kind: 'hill-climb';
  id: string;
  startedAt: string;
  finishedAt?: string;
  status: 'running' | 'verified' | 'not-verified' | 'no-improvement' | 'no-defect' | 'error' | 'cancelled';
  suite: Suite;
  suiteHash: string;
  strategy: Suite['strategy'];
  config: {repetitions: number; maxRounds: number; maxCalls: number};
  calls: number;
  runner: {name: string; version: string; model: string; judge: string};
  original: Version;
  baseline: Evaluation | null;
  rounds: Round[];
  selected: Evaluation | null;
  verification: {baseline: Evaluation | null; candidate: Evaluation | null; decision: Decision | null} | null;
  inProgress?: {label: string; samples: Sample[]};
  limitation: string;
  stopReason?: string;
  error?: string;
}
export function hillClimb(options: {
  content: string;
  suite: Suite;
  adapter: Adapter;
  judge?: Adapter;
  proposer?: Adapter;
  repetitions?: number;
  maxRounds?: number;
  maxCalls?: number;
  signal?: AbortSignal;
  onEvent?: (event: {type: string; calls: number; [key: string]: unknown}) => void | Promise<void>;
  checkpoint?: (report: Session) => void | Promise<void>;
}): Promise<Session>;
export function evaluateSkill(options: {
  content: string; cases: GymCase[]; adapter: Adapter; judge?: Adapter;
  repetitions?: number; label?: string; signal?: AbortSignal;
  onSample?: (sample: Sample, samples: Sample[]) => void | Promise<void>;
}): Promise<Evaluation>;
export function compareEvaluations(before: Evaluation, after: Evaluation, strategy: Suite['strategy']): Decision;
export function summarize(samples: Array<Pick<Sample, 'caseId' | 'passed'>>): Score;
export function validateProposal(original: string, content: string): string;
export function createCodexAdapter(options: {model?: string; workDir: string; timeoutMs?: number; onProgress?: (message: string) => void}): Adapter;
export function createFileStore(directory: string): {save(report: {id: string; [key: string]: unknown} | Session): Promise<string>};
export function hash(text: string): string;
export function words(text: string): number;
export function version(content: string): Version;
export function ablate(content: string): string;
export function validateSuite(suite: Suite): Suite;
export function runGym(options: {suiteDir: string; outputDir: string; adapter: Adapter; model?: string; onProgress?: (message: string) => void}): Promise<{run: Record<string, unknown>; resultPath: string}>;
