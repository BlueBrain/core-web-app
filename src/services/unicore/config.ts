import { GeneralJobDefinition, DataToUpload } from '@/services/unicore/types';

export const PLACEHOLDERS = {
  TOKEN: '{TOKEN}',
  TOKEN_TEMP_FILENAME: 'TMP_FILE_TK',
};

export const UNICORE_BASE = 'https://unicore.bbp.epfl.ch:8080/BB5-CSCS/rest/core';

export const UNICORE_JOB_CONFIG: GeneralJobDefinition = {
  title: 'test from sbo',
  runtime: '10m',
  nodeType: 'cpu',
  project: 'proj134',
  executable: '/bin/sh -l input.sh',
  tags: ['bbp-workflow', 'sbo'],
  partition: 'prod',
};

export const UNICORE_FILES: DataToUpload[] = [
  {
    To: 'input.sh',
    Data: [
      `token=$(cat ${PLACEHOLDERS.TOKEN_TEMP_FILENAME})`,
      'module load unstable py-bbp-workflow-cli',
      'export K8S_TKN=$token && bbp-workflow version',
      `rm ${PLACEHOLDERS.TOKEN_TEMP_FILENAME}`,
    ].join('\n'),
  },
  {
    To: PLACEHOLDERS.TOKEN_TEMP_FILENAME,
    Data: PLACEHOLDERS.TOKEN,
  },
];
