type Rejection = {
  '@type': 'ResourceNotFound';
  reason: "File 'https://creativecommons.org/licenses/by-nc-sa/4.0/' not found in project 'public/thalamus'.";
  status: 404;
};

export type LicenseResource = {
  '@context': string;
  '@type': string;
  license?: { name: string };
  rejections?: Rejection[];
};
