'use client';

import { useState, useRef, useEffect } from 'react';
import { Modal, Button, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import BluePyEModelContainer from './BluePyEModelContainer';

type ModalProps = {
  onClose: () => void;
  vlHomeLink: string;
};

function ModalContent({ onClose, vlHomeLink }: ModalProps) {
  return (
    <>
      <div className="flex flex-col items-start justify-start gap-y-3">
        <div className="inline-flex items-center gap-x-2">
          <h2 className="text-2xl font-bold text-primary-8">Running analysis</h2>
        </div>
        <p className="text-primary-8">
          Once your analysis will be done, you can easily find it in the activity section in your
          project.
        </p>
      </div>

      <div className="my-10 flex flex-col items-center justify-center gap-y-10 text-2xl">
        <ElapsedTime />
      </div>

      <InstructionsFindAnalysis />

      <div className="mt-8 text-center">
        <Button
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-none border-none px-5 py-6 shadow-none"
        >
          Cancel
        </Button>
        <Button
          type="link"
          ghost
          className="ml-2 inline-flex items-center justify-center rounded-none border border-solid border-primary-8 px-8 py-6"
          href={vlHomeLink}
        >
          Go to Project home
        </Button>

        <BluePyEModelContainer />
      </div>
    </>
  );
}

export function usePendingValidationModal() {
  const [modal, contextHolder] = Modal.useModal();
  const destroyRef = useRef<() => void>();
  const onClose = () => destroyRef?.current?.();

  function createModal(vlHomeLink: string) {
    const { destroy } = modal.confirm({
      title: null,
      icon: null,
      closable: true,
      maskClosable: true,
      footer: null,
      width: 680,
      centered: true,
      mask: true,
      styles: {
        mask: { background: '#002766ba' },
        body: { padding: '60px 40px 20px' },
      },
      closeIcon: <CloseOutlined className="text-2xl text-primary-8" />,
      className: '![&>.ant-modal-content]:bg-red-500',
      content: <ModalContent onClose={onClose} vlHomeLink={vlHomeLink} />,
    });
    destroyRef.current = destroy;
    return destroy;
  }

  return {
    createModal,
    contextHolder,
  };
}

function ElapsedTime() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <>
      <Spin size="large" />
      <div className="text-primary-8">
        <div>Time elapsed:</div>
        <div>{formatTime(elapsedSeconds)}</div>
      </div>
    </>
  );
}

function InstructionsFindAnalysis() {
  return (
    <div>
      <div className="font-bold text-primary-8">Where to find my analysis?</div>
      <div className="grid grid-cols-3">
        <div>
          <div className="font-thin text-gray-400">Step 1</div>
          <div className="text-primary-8">
            From your virtual lab, go into the project in which you’ve launched an analysis or a
            build.
          </div>
        </div>
        <div>
          <div className="font-thin text-gray-400">Step 2</div>
          <div className="text-primary-8">
            On the left sidebar, find the activity panel. You can see what’s running and what is
            ready for you.
          </div>
        </div>
        <div>
          {/* image of activity on the left side panel */}
          <svg
            width="152"
            height="152"
            viewBox="0 0 152 152"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="106" height="20" fill="#F5F5F5" />
            <circle cx="10" cy="10" r="5" fill="#8C8C8C" />
            <rect width="106" height="20" transform="translate(0 21)" fill="#F5F5F5" />
            <circle cx="10" cy="31" r="5" fill="#8C8C8C" />
            <rect width="106" height="20" transform="translate(0 42)" fill="#F5F5F5" />
            <circle cx="10" cy="52" r="5" fill="#8C8C8C" />
            <rect x="0.5" y="63.5" width="105" height="25" stroke="#003A8C" />
            <path
              d="M5.187 79.5L6.87 72.02H9.752L11.435 79.5H9.917L9.62 78.147H7.002L6.705 79.5H5.187ZM8.047 73.274L7.288 76.827H9.334L8.575 73.274H8.047ZM14.3025 73.868C14.6838 73.868 15.1715 73.9267 15.7655 74.044L16.0625 74.11L16.0185 75.276C15.4391 75.2173 15.0101 75.188 14.7315 75.188C14.2255 75.188 13.8881 75.298 13.7195 75.518C13.5581 75.7307 13.4775 76.1377 13.4775 76.739C13.4775 77.3403 13.5581 77.7547 13.7195 77.982C13.8881 78.202 14.2291 78.312 14.7425 78.312L16.0185 78.224L16.0625 79.401C15.2778 79.555 14.6801 79.632 14.2695 79.632C13.4555 79.632 12.8688 79.4047 12.5095 78.95C12.1575 78.488 11.9815 77.751 11.9815 76.739C11.9815 75.727 12.1648 74.9973 12.5315 74.55C12.8981 74.0953 13.4885 73.868 14.3025 73.868ZM20.2017 75.254H18.8487V77.509C18.8487 77.729 18.8523 77.8867 18.8597 77.982C18.8743 78.07 18.9147 78.147 18.9807 78.213C19.054 78.279 19.164 78.312 19.3107 78.312L20.1467 78.29L20.2127 79.467C19.7213 79.577 19.3473 79.632 19.0907 79.632C18.4307 79.632 17.9797 79.4853 17.7377 79.192C17.4957 78.8913 17.3747 78.3413 17.3747 77.542V75.254H16.7257V74H17.3747V72.471H18.8487V74H20.2017V75.254ZM21.1615 79.5V74H22.6355V79.5H21.1615ZM21.1615 73.296V71.8H22.6355V73.296H21.1615ZM23.4804 74H25.0204L25.9004 78.246H26.2084L27.1324 74H28.6284L27.3084 79.5H24.8004L23.4804 74ZM29.4759 79.5V74H30.9499V79.5H29.4759ZM29.4759 73.296V71.8H30.9499V73.296H29.4759ZM35.3589 75.254H34.0059V77.509C34.0059 77.729 34.0095 77.8867 34.0169 77.982C34.0315 78.07 34.0719 78.147 34.1379 78.213C34.2112 78.279 34.3212 78.312 34.4679 78.312L35.3039 78.29L35.3699 79.467C34.8785 79.577 34.5045 79.632 34.2479 79.632C33.5879 79.632 33.1369 79.4853 32.8949 79.192C32.6529 78.8913 32.5319 78.3413 32.5319 77.542V75.254H31.8829V74H32.5319V72.471H34.0059V74H35.3589V75.254ZM35.8127 74H37.2647L38.2657 78.246H38.5187L39.5197 74H40.9717L39.0357 81.81H37.5947L38.1997 79.5H37.1657L35.8127 74Z"
              fill="#003A8C"
            />
            <circle cx="97" cy="76" r="4" fill="#F64141" />
            <rect width="106" height="20" transform="translate(0 90)" fill="#F5F5F5" />
            <circle cx="10" cy="100" r="5" fill="#8C8C8C" />
            <rect width="106" height="20" transform="translate(0 111)" fill="#F5F5F5" />
            <circle cx="10" cy="121" r="5" fill="#8C8C8C" />
            <rect width="106" height="20" transform="translate(0 132)" fill="#F5F5F5" />
            <circle cx="10" cy="142" r="5" fill="#8C8C8C" />
            <path
              d="M131.312 90.728C131.132 90.728 130.229 90.64 129.325 89.8448C128.332 89.0064 127.79 87.6816 127.654 85.9583C127.383 85.7824 127.113 85.5616 126.841 85.208C126.073 84.2368 125.666 82.7343 125.622 80.792C125.396 80.616 125.124 80.3055 124.854 79.9536C124.222 79.0704 123.861 77.9664 123.725 76.5968L120.065 76.5968C119.704 76.5968 118.169 76.6416 117.083 75.6256C116.586 75.184 116 74.3457 116 72.9311C116 71.4735 116.588 70.6352 117.083 70.1487C118.123 69.2206 119.478 69.2206 119.794 69.2206L132.713 69.2206C131.81 68.3823 130.816 67.4542 130.455 66.9246C129.597 65.8206 130.049 63.7455 130.952 62.5535C131.81 61.4046 133.121 61.0079 134.386 61.4495C136.644 62.2447 138.903 64.2319 139.444 64.7166C140.302 65.1582 144.051 67.1454 145.406 68.9119C146.13 69.8399 149.11 70.5454 151.007 70.7231L152 70.8111L152 87.504L147.529 87.504C146.897 87.7248 145.542 88.2544 144.909 88.8288C143.508 90.1985 139.986 90.6401 138.901 90.6401L131.358 90.6401L131.312 90.728ZM138.811 88.5631C140.12 88.5631 142.605 88.0336 143.282 87.3712C144.457 86.2223 146.716 85.5168 146.942 85.4719L147.078 85.4271L149.698 85.4271L149.698 72.7982C149.2 72.7102 148.569 72.6222 147.891 72.4446C145.722 71.915 144.323 71.2077 143.6 70.2814C142.606 69.0015 139.399 67.1902 138.225 66.6158L137.954 66.4398C137.908 66.4398 135.649 64.2767 133.573 63.5246C133.301 63.4366 133.075 63.4366 132.759 63.7454C132.218 64.3198 132.082 65.4238 132.172 65.6877C132.713 66.3501 134.928 68.3822 136.237 69.5293L138.405 71.4285L119.75 71.4302L119.658 71.4302C119.478 71.4302 118.89 71.4751 118.575 71.7838C118.303 72.0046 118.169 72.4014 118.169 72.9758C118.169 73.4623 118.305 73.8142 118.531 74.0798C118.936 74.4334 119.66 74.4766 119.932 74.4766L131.63 74.4766L131.63 76.6397L125.937 76.6397C126.163 78.6269 127.021 79.2013 127.157 79.2893L127.382 79.3773L131.628 79.3773L131.628 81.5404L127.878 81.5404C128.058 83.3948 128.646 84.1021 128.917 84.278L133.209 84.278L133.209 86.4411L129.911 86.4411C130.183 88.3404 131.22 88.6491 131.446 88.694L138.811 88.6957L138.811 88.5631Z"
              fill="#003A8C"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
