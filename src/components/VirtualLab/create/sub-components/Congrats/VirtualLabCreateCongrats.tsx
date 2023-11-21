import React from 'react';
import { CheckCircleFilled } from '@ant-design/icons';

import { Button } from '../Button';
import { useCurrentVirtualLab } from '../../hooks/current-virtual-lab';
import { EMPTY_VIRTUAL_LAB } from '../../constants';
import { classNames } from '@/util/utils';

import styles from './virtual-lab-create-congrats.module.css';
// eslint-disable-next-line import/order
import commonStyles from '../../common.module.css';

export interface VirtualLabCreateCongratsProps {
  className?: string;
}

export function VirtualLabCreateCongrats({ className }: VirtualLabCreateCongratsProps) {
  const [lab, update] = useCurrentVirtualLab();
  const resetCurrentVirtualLab = () => {
    update(EMPTY_VIRTUAL_LAB);
  };
  return (
    <div className={classNames(styles.main, commonStyles.theme, className)}>
      <div>
        {lab.id ? (
          <>
            <header>
              <CheckCircleFilled />
            </header>
            <h1>Congratulations! Your virtual lab has been created.</h1>
            <Button
              href={`/virtual-lab/lab/${lab.id}`}
              variant="primary"
              onClick={resetCurrentVirtualLab}
            >
              Go to workspace
            </Button>
          </>
        ) : (
          <Button href="/virtual-lab/create/information" variant="text">
            Please create a Virtual Lab
          </Button>
        )}
      </div>
    </div>
  );
}
