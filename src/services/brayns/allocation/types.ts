export interface BackendAllocationOptions {
  account: string;
  partition: string;
  memory: string;
  onProgress(message: string): void;
}

export interface JobAllocatorServiceInterface {
  createJob(): Promise<string>;
  getJobStatus(jobId: string): Promise<JobStatus>;
  loadTextFile(jobId: string, filename: string): Promise<string | null>;
}

export interface JobStatus {
  hostname: string;
  status: 'RUNNING' | 'WAITING' | 'ERROR';
  startTime: Date | null;
}
