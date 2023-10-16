import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { notification, Modal } from 'antd';
import { useAtomValue } from 'jotai/react';

import { basePath } from '@/config';
import { classNames } from '@/util/utils';
import {
  getWorkflowAuthUrl,
  launchUnicoreWorkflowSetup,
  launchWorkflowTask,
} from '@/services/bbp-workflow';
import {
  WORKFLOW_TEST_TASK_NAME,
  WORKFLOW_SIMULATION_TASK_NAME,
} from '@/services/bbp-workflow/config';
import generateWorkflowConfig from '@/services/bbp-workflow/placeholderReplacer';
import { configAtom } from '@/state/brain-model-config';
import { targetConfigToBuildAtom } from '@/state/build-status';
import circuitAtom from '@/state/circuit';
import GenericButton from '@/components/Global/GenericButton';

const HIDDEN_IFRAME_AUTO_AUTH_AWAIT_DELAY = 5000;

function useWorkflowAuth() {
  const ensureWorkflowAuth = useCallback(
    (username: string) =>
      new Promise<void>((resolve, reject) => {
        const authSuccessPageUrl = `${window.location.origin}${basePath}/svc/bbp-workflow/auth-success`;
        /*
          In order for BBP Workflow to function we need to make sure it is authenticated.

          To do so the user needs to visit the `workflowAuthUrl` page which handles that by redirecting
          to BBP Keycloak if the offline token isn't present and has an auth success redirect to a URL of our choice.

          The Keycloak only allows auth page to be opened in an iframe from *bbp.epfl.ch origins,
          so to make the user experience as smooth as possible we do that as follows:
          - For localhost: the `workflowAuthUrl` is opened in a separate window/tab with an auth success
            redirect URL set to `authSuccessPageUrl` which notifies the app when authenticated.
          - For the rest (assuming *bbp.epfl.ch):
            - The `workflowAuthUrl` is opened in a hidden iframe with the same redirect setup from above.
              If the app isn't notified about auth success in HIDDEN_IFRAME_AUTO_AUTH_AWAIT_DELAY (5) seconds
              which, most likely means that workflow isn't authenticated and has executed the redirect to Keycloak,
              the hidden iframe is getting removed and the user is presented with a modal containing
              normal iframe (presumably with Keycloak auth form) to enter credentials.
        */

        const workflowAuthUrl = `${getWorkflowAuthUrl(username)}?url=${authSuccessPageUrl}`;

        const isLocalhost = window.location.origin.includes('localhost');

        let hiddenIframeEl: HTMLIFrameElement;
        let hiddenIframeTimeout: ReturnType<typeof setTimeout>;
        let destroyModal: () => void;

        const onWorkflowAuthReadyHandler = (evt: MessageEvent) => {
          if (evt.data !== 'bbpWorkflowAuthReady') return;

          window.removeEventListener('message', onWorkflowAuthReadyHandler);

          if (hiddenIframeTimeout) {
            clearTimeout(hiddenIframeTimeout);
          }

          if (hiddenIframeEl) {
            document.body.removeChild(hiddenIframeEl);
          }

          if (destroyModal) {
            destroyModal();
          }

          resolve();
        };

        if (isLocalhost) {
          const authWindow = window.open(workflowAuthUrl, '_blank');

          if (!authWindow) {
            const msg =
              'Auth window has been blocked. Please make sure popups are allowed and run again';
            reject(new Error(msg));
          }
        } else {
          hiddenIframeEl = document.createElement('iframe');
          hiddenIframeEl.setAttribute('src', workflowAuthUrl);
          hiddenIframeEl.style.display = 'none';

          document.body.appendChild(hiddenIframeEl);

          hiddenIframeTimeout = setTimeout(() => {
            document.body.removeChild(hiddenIframeEl);

            destroyModal = Modal.warning({
              title: 'Please authenticate to use BBP Workflow',
              footer: null,
              closable: true,
              maskClosable: false,
              mask: true,
              width: 640,
              content: (
                <iframe title="Workflow auth" src={workflowAuthUrl} width="100%" height="480px" />
              ),
              onCancel: () => reject(new Error('cancelled')),
            }).destroy;
          }, HIDDEN_IFRAME_AUTO_AUTH_AWAIT_DELAY);
        }

        window.addEventListener('message', onWorkflowAuthReadyHandler, false);
      }),
    []
  );

  return { ensureWorkflowAuth };
}

type Props = {
  buttonText?: string;
  workflowName?: string;
  onLaunchingChange?: (isLoading: boolean, url: string | null) => void;
  className?: string;
  disabled?: boolean;
  extraVariablesToReplace?: Record<string, any>;
};

export default function WorkflowLauncher({
  buttonText = 'Launch BBP-Workflow',
  workflowName = WORKFLOW_TEST_TASK_NAME,
  onLaunchingChange = () => {},
  className = '',
  disabled = false,
  extraVariablesToReplace = {},
}: Props) {
  const [launching, setLaunching] = useState(false);
  const { data: session } = useSession();
  const { ensureWorkflowAuth } = useWorkflowAuth();

  const circuitInfo = useAtomValue(circuitAtom);
  const targetConfigToBuild = useAtomValue(targetConfigToBuildAtom);
  const config = useAtomValue(configAtom);

  const launchBbpWorkflow = async () => {
    if (!session?.user) return;
    if (!config) return;
    if (workflowName === WORKFLOW_SIMULATION_TASK_NAME && !circuitInfo) return;

    let workflowExecutionUrl = null;
    onLaunchingChange(true, workflowExecutionUrl);
    setLaunching(true);

    let workflowConfig;
    try {
      workflowConfig = await generateWorkflowConfig(
        workflowName,
        circuitInfo,
        targetConfigToBuild,
        config,
        session,
        extraVariablesToReplace
      );
    } catch (e: any) {
      notification.error({
        message: e.message,
      });
      onLaunchingChange(false, workflowExecutionUrl);
      setLaunching(false);
      return;
    }

    try {
      await launchUnicoreWorkflowSetup(session.accessToken);

      // make sure the offline token is set
      await ensureWorkflowAuth(session.user.username);

      workflowExecutionUrl = await launchWorkflowTask({
        loginInfo: session,
        workflowName,
        workflowFiles: workflowConfig,
      });

      notification.success({
        message: 'Workflow launched successfuly',
        description: (
          <span>
            You can watch the progress of launched tasks in your{' '}
            <a
              href={`https://bbp-workflow-${session.user.username}.kcp.bbp.epfl.ch/static/visualiser/index.html#order=4%2Cdesc`}
              target="_blank"
            >
              Workflow dashboard
            </a>
            .
          </span>
        ),
        duration: 10,
      });
    } catch (e: any) {
      if (e?.message === 'cancelled') return;

      notification.open({
        message: 'Error launching workflow',
        description: e?.message ?? '',
        duration: null,
      });
    }
    onLaunchingChange(false, workflowExecutionUrl);
    setLaunching(false);
  };

  const buttonClass = classNames(
    'flex-auto text-white',
    className,
    disabled || launching ? 'bg-slate-400 cursor-not-allowed pointer-events-none' : 'bg-secondary-2'
  );

  const buttonTooltip = disabled ? 'Select at least one step to build' : 'Build step(s)';

  return (
    <GenericButton
      onClick={launchBbpWorkflow}
      className={buttonClass}
      disabled={disabled}
      title={buttonTooltip}
      text={launching ? 'Launching...' : buttonText}
    />
  );
}
