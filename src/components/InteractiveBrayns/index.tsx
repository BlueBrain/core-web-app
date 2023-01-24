'use client';

import { useSession } from 'next-auth/react';
import React from 'react';
import { useAtomValue } from 'jotai/react';
import convertStringColorIntoArrayColor from './convert-string-color-into-array-color';
import BraynsScene from '@/components/BraynsScene';
import { BraynsSceneController } from '@/components/BraynsScene/types';
import Spinner from '@/components/Spinner';
import { SignInButton } from '@/components/LoginButton/buttons';
import AtlasVisualizationAtom from '@/state/atlas';
import styles from './interactive-brayns.module.css';

export default function CellModelAssignmentView() {
  const atlas = useAtomValue(AtlasVisualizationAtom);
  const [controller, setController] = React.useState<null | BraynsSceneController>(null);
  const { data: session } = useSession();
  React.useEffect(() => {
    // eslint-disable-next-line no-restricted-syntax
    for (const mesh of atlas.visibleMeshes) {
      console.log('🚀 [page] mesh.contentURL = ', mesh.contentURL); // @FIXME: Remove this line written on 2023-01-24 at 17:19
      if (session && controller) {
        controller
          .loadMeshFromURL({
            url: mesh.contentURL,
            token: session.accessToken,
            color: convertStringColorIntoArrayColor(mesh.color),
          })
          .then((content) => console.log('Mesh loading result:', content));
      }
    }
  }, [atlas.visibleMeshes, session, controller]);
  if (!session)
    return (
      <div className={styles.fullscreen}>
        <SignInButton />
      </div>
    );

  const handleControllerReady = async (newController: BraynsSceneController) => {
    setController(newController);
    await newController.clear();
    newController.setBackgroundColor({ color: [0, 0, 0] });
    newController.loadMesh({
      path: '/gpfs/bbp.cscs.ch/project/proj3/tolokoban/brain.obj',
      color: [0.8, 0.9, 1, 0.05],
    });
  };

  return (
    <>
      <BraynsScene
        className={styles.fullscreen}
        account="proj134"
        token={session.accessToken}
        onReady={handleControllerReady}
      />
      {!controller && (
        <div className={styles.fullscreen}>
          <Spinner>BB5 node allocation in progress...</Spinner>
        </div>
      )}
    </>
  );
}
