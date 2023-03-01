export interface RequestProps {
  url: string;
  method?: string;
  body?: BodyInit;
  headers?: HeadersInit;
}

export interface UrlToComputerAndIdInterface {
  computer: string | null;
  id: string | null;
}

export interface DataToUpload {
  Data: string;
  To: string;
}

export interface UnicoreJobDefinition {
  // TODO be less flexible here
  Name?: string;
  Executable?: string;
  Environment?: string[];
  Arguments?: never[];
  haveClientStageIn?: string;
  Resources?: {
    Nodes?: number;
    CPUsPerNode?: number;
    Runtime?: string | number;
    Memory?: string | number;
    NodeConstraints?: string;
    Queue?: string;
    Project?: string;
    TotalCPUs?: number;
  };
  Partition: string;
  Tags?: string[];
  Imports?: DataToUpload[];
}

export interface GeneralJobDefinition {
  title: string;
  runtime: string | number;
  nodes?: number;
  cpusPerNode?: number;
  memory?: number | string;
  project: string;
  executable: string;
  tags: Array<string>;
  nodeType?: string;
  imports?: Array<DataToUpload>;
  partition: string;
  environment?: string[];
}

export interface JobProperties {
  acl: [];
  currentTime: string;
  exitCode: string;
  id: string;
  log: Array<string>;
  name: string;
  owner: string;
  queue: string;
  resourceStatus: string;
  status: UnicoreStatuses;
  statusMessage: string;
  submissionPreferences: { UC_OAUTH_BEARER_TOKEN: Array<string> };
  submissionTime: string;
  tags: [];
  terminationTime: string;
  _links: {
    self: {
      href: string;
    };
    workingDirectory: {
      href: string;
    };
    'action:start': {
      href: string;
    };
  };
}

export type UnicoreStatuses = 'SUCCESSFUL' | 'ERROR' | 'FAILED';
