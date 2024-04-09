export type VirtualLabAPIResponse = {
  message: string;
  data: {
    virtual_lab: VirtualLab;
  };
};

export type VirtualLabAPIListResponse<ResponseType> = {
  message: string;
  data: VirtualLabAPIListData<ResponseType>;
};

export type VirtualLabAPIListData<ReponseType> = {
  results: ReponseType[];
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

export interface VirtualLabMember {
  name: string;
  email: string;
  role: 'admin' | 'user';
  lastActive?: number;
}

export type NewMember = Pick<VirtualLabMember, 'email' | 'role'>;

export type MockBilling = {
  organization: string;
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};
