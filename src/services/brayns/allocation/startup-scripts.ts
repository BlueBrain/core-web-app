import Settings from '../settings';

const MODULE_ARCHIVE = 'unstable';
const MODULE_BRAYNS = 'brayns/3.2.0';

const BRAYNS_STARTUP_SCRIPT = `echo
echo Loading ${MODULE_BRAYNS} from ${MODULE_ARCHIVE}...
module purge
module load ${MODULE_ARCHIVE}
module load ${MODULE_BRAYNS}
braynsService \\
    --uri 0.0.0.0:$RENDERER_PORT \\
    --log-level debug \\
    --secure true \\
    --certificate-file $UNICORE_CERT_FILEPATH \\
    --private-key-file $UNICORE_PRIVATE_KEY_FILEPATH \\
    --plugin braynsCircuitExplorer \\
    --plugin braynsAtlasExplorer`;

const BACKEND_STARTUP_SCRIPT = `
source \${BACKEND_DIR}venv/bin/activate

python \${BACKEND_DIR}src/main.py \\
    --certificate-file=$UNICORE_CERT_FILEPATH \\
    --private-key-file=$UNICORE_PRIVATE_KEY_FILEPATH \\
    --port=$BACKEND_PORT`;

// eslint-disable-next-line import/prefer-default-export
export const NODE_STARTUP_SCRIPT = `
#!/bin/bash

source /etc/profile.d/bb5.sh
source /etc/profile.d/modules.sh

export BACKEND_DIR=/gpfs/bbp.cscs.ch/project/proj3/software/BraynsCircuitStudio/backend/
export BACKEND_PORT=${Settings.BRAYNS_BACKEND_PORT}
export RENDERER_PORT=${Settings.BRAYNS_RENDERER_PORT}
export LOG_LEVEL=DEBUG
export UNICORE_HOSTNAME=$(hostname -f)
export UNICORE_CERT_FILEPATH=\${TMPDIR}/\${UNICORE_HOSTNAME}.crt
export UNICORE_PRIVATE_KEY_FILEPATH=\${TMPDIR}/\${UNICORE_HOSTNAME}.key

echo Brayns Circuit Studio startup script
echo ----------------------
echo "HOSTNAME=$(hostname -f)"
echo UNICORE_HOSTNAME=$UNICORE_HOSTNAME
echo UNICORE_CERT_FILEPATH=$UNICORE_CERT_FILEPATH
echo UNICORE_PRIVATE_KEY_FILEPATH=$UNICORE_PRIVATE_KEY_FILEPATH
echo TMPDIR=$TMPDIR
echo BACKEND_PORT=$BACKEND_PORT
echo RENDERER_PORT=$RENDERER_PORT
echo ----------------------
${BRAYNS_STARTUP_SCRIPT} &
${BACKEND_STARTUP_SCRIPT}
`;
