import { UploadFile } from 'antd';
import { Distribution } from '@/types/nexus';

export type Position = 'left' | 'right' | 'full' | undefined;
export type UploadFileMetadata = {
  id: string;
  alt?: string;
  name?: string;
  preview: string | null;
  file: UploadFile;
  position?: Position;
};

export type UploaderGeneratorResponse =
  | {
      source: 'binary';
      status: 'success' | 'failed';
      id: string;
    }
  | {
      source: 'resource';
      status: 'success' | 'failed';
    }
  | null;

export type OnUploadCallback = (
  payload: Array<Distribution>,
  files: Array<UploadFileMetadata>
) => void;

export type OnUploadInput = {
  accessToken: string;
  uploadUrl: string;
  files: Array<UploadFileMetadata>;
  location: {
    id: string;
    org: string;
    project: string;
  };
  callback?: OnUploadCallback;
};

export type UploaderGenerator = (
  files: Array<UploadFileMetadata>,
  cb?: OnUploadCallback
) => AsyncGenerator<UploaderGeneratorResponse, void, unknown>;

export type UseImageUploaderInput = {
  id: string;
  multiple: boolean;
  type: 'image' | 'video';
};
