import { RcFile } from 'antd/lib/upload';
import { GetProp, UploadProps } from 'antd';
import isString from 'lodash/isString';

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export type VideoThumbnailMetadata = {
  url: string | null;
  width: number;
  height: number;
};

export const getBase64 = (file: FileType): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const getRcFileImageUrl = async (file: RcFile) => {
  const buffer = await file.arrayBuffer();
  const blob = new Blob([buffer]);
  return URL.createObjectURL(blob);
};

export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = url;
  });
}

export function generateVideoThumbnail(file: File | string): Promise<VideoThumbnailMetadata> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.src = isString(file) ? file : URL.createObjectURL(file);

    video.onerror = (error) => {
      reject(error);
    };

    video.onloadeddata = () => {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      if (!isString(file)) {
        video.currentTime = video.duration / 2;
        ctx.drawImage(video, 0, 0);
        const url = canvas.toDataURL();
        resolve({
          url,
          width: video.videoWidth,
          height: video.videoHeight,
        });
      }
      resolve({
        url: null,
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };
  });
}
