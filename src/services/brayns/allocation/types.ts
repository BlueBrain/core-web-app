export interface BackendAllocationOptions {
  account: string;
  partition: string;
  memory: string;
  onProgress(message: string): void;
}
