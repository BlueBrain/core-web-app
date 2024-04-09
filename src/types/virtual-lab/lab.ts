export type VirtualLabAPIResponse = {
  message: string;
  data: {
    virtual_lab: VirtualLab;
  };
};

export type VirtualLabAPIListResponse = {
  message: string;
  data: VirtualLabAPIListData;
};

export type VirtualLabAPIListData = {
  results: Project[];
  page: number;
  size: number;
  page_size: number;
  total: number;
};

export type VirtualLab = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  reference_email: string;
  budget: number;
  plan_id: number;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  budget: number;
  created_at: string;
  updated_at: string;
};

export enum VirtualLabPlanType {
  entry = 'entry',
  beginner = 'beginner',
  intermediate = 'intermediate',
  advanced = 'advanced',
}
