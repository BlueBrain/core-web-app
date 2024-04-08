export type VirtualLabResponse = {
  message: string;
  data: {
    virtual_lab: VirtualLab;
  };
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
