export interface Allocation {
  host: string;
  endTime: number;
}

export interface JobAllocatorServiceInterface {
  createJob(): Promise<string>;
  getJobStatus(jobId: string): Promise<JobStatus>;
  loadTextFile(jobId: string, filename: string): Promise<string | null>;
}

export interface JobStatus {
  hostname: string;
  status: 'RUNNING' | 'WAITING' | 'ERROR';
  endTime: number;
}

export interface ProxyServiceOptions {
  token: string;
  url: string;
}

export interface JobOptions {
  // "SBO1", ...
  usecase: string;
}
