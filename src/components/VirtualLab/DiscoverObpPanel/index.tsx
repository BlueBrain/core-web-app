import DiscoverLinks from './DiscoverLinks';
import DiscoverObpItem from './DiscoverObpItem';
import { basePath } from '@/config';

export default function DiscoverObpPanel() {
  return (
    <div className="mt-10 flex flex-col gap-5">
      <div className="font-bold uppercase">Discover OBP</div>
      <div className="flex w-full flex-row gap-3">
        <DiscoverObpItem
          imagePath={`${basePath}/images/virtual-lab/obp_full_brain_blue.png`}
          title="Explore"
          subtitle="How do I explore?"
          body={
            <ul className="list-inside list-disc">
              <li>Vivamus sagittis lacus vel augue faucibus dolor auctor.</li>
              <li>Curabitur blandit tempus porttitor.</li>
              <li>Donec sed odio dui.</li>
              <li>
                Vestibulum id ligula porta felis euismod semper. Morbi leo risus, porta ac
                consectetur ac, vestibulum at eros.
              </li>
            </ul>
          }
          bottomElement={
            <DiscoverLinks
              topLink="/virtual-lab/tutorials/explore"
              topText="How can I explore the brain?"
              bottomLink="explore"
              bottomText="Start exploring"
            />
          }
        />
        <DiscoverObpItem
          imagePath={`${basePath}/images/virtual-lab/obp_vl_build.png`}
          title="Build"
          subtitle="How can I build models?"
          body={
            <ul className="list-inside list-disc">
              <li>Vivamus sagittis lacus vel augue faucibus dolor auctor.</li>
              <li>Curabitur blandit tempus porttitor.</li>
              <li>Donec sed odio dui.</li>
              <li>
                Vestibulum id ligula porta felis euismod semper. Morbi leo risus, porta ac
                consectetur ac, vestibulum at eros.
              </li>
            </ul>
          }
          bottomElement={
            <DiscoverLinks
              topLink="/virtual-lab/tutorials/build"
              topText="How can I build models?"
              bottomLink="build"
              bottomText="View models"
            />
          }
        />
        <DiscoverObpItem
          imagePath={`${basePath}/images/virtual-lab/obp_vl_simulate.png`}
          title="Simulate"
          subtitle="How can I launch simulations?"
          body={
            <ul className="list-inside list-disc">
              <li>Vivamus sagittis lacus vel augue faucibus dolor auctor.</li>
              <li>Curabitur blandit tempus porttitor.</li>
              <li>Donec sed odio dui.</li>
              <li>
                Vestibulum id ligula porta felis euismod semper. Morbi leo risus, porta ac
                consectetur ac, vestibulum at eros.
              </li>
            </ul>
          }
          bottomElement={
            <DiscoverLinks
              topLink="/virtual-lab/tutorials/simulate"
              topText="How can I launch simulations?"
              bottomLink="simulate"
              bottomText="View simulations"
            />
          }
        />
      </div>
    </div>
  );
}
