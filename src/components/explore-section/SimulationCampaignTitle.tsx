import { useAtomValue } from 'jotai';
import { simulationCampaignTitleAtom } from '@/state/explore-section/simulation-campaign';

export default function SimulationCampaignTitle() {
  const title = useAtomValue(simulationCampaignTitleAtom);
  return <span>{title}</span>;
}
