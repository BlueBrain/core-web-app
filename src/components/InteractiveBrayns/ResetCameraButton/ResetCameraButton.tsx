/* eslint-disable @typescript-eslint/no-use-before-define */
import { classNames } from '@/util/utils';
import Styles from './reset-camera-button.module.css';

export interface ResetCameraButtonProps {
  className?: string;
  onClick(): void;
}

export default function ResetCameraButton({ className, onClick }: ResetCameraButtonProps) {
  return (
    <button
      className={classNames(Styles.resetCameraButton, className)}
      type="button"
      onClick={onClick}
    >
      <div>Reset</div>
      <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.34288 0C3.57725 0 1.26899 2.00089 0.782135 4.62852H0L1.37141 6.34279L2.74283 4.62852H1.82676C2.29417 2.5654 4.13571 1.02856 6.34283 1.02856C8.9048 1.02856 10.9714 3.09511 10.9714 5.65709C10.9714 8.21906 8.9048 10.2856 6.34283 10.2856C4.62187 10.2856 3.12789 9.35481 2.33041 7.96603L1.48399 8.54995C2.47304 10.2033 4.28099 11.3142 6.34291 11.3142C9.46134 11.3142 12 8.77555 12 5.65712C12 2.53869 9.4613 0 6.34288 0ZM4.62861 6.51422H7.20001V3.08568H6.17145V5.48566H4.62861"
          style={{ fill: 'currentcolor' }}
        />
      </svg>
    </button>
  );
}
