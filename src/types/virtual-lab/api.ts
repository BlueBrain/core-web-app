import { VirtualLab } from './lab';

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
