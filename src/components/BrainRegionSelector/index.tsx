import React, { useCallback, useEffect, useState } from 'react';
import { atom, useSetAtom, useAtomValue } from 'jotai';
import * as Accordion from '@radix-ui/react-accordion';
import { arrayToTree } from 'performant-array-to-tree';
import { Button } from 'antd';
import { EyeInvisibleFilled } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import utils from '@/util/utils';
import BrainIcon from '@/components/icons/Brain';
import BrainRegionIcon from '@/components/icons/BrainRegion';
import AngledArrowIcon from '@/components/icons/AngledArrow';
import TreeNavItem, { TreeChildren, TreeNavItemCallbackProps } from '@/components/tree-nav-item';
import BrainRegionMeshTrigger, { Distribution } from '@/components/BrainRegionMeshTrigger';
import PointCloudTrigger from '@/components/PointCloudTrigger';
import styles from './brain-region-selector.module.css';

const { fetchAtlasAPI, classNames } = utils;

const atlasIdUri =
  'https://bbp.epfl.ch/neurosciencegraph/data/4906ab85-694f-469d-962f-c0174e901885';

async function getBrainRegionsTree(accessToken: string) {
  if (!accessToken) throw new Error('Access token should be defined');

  return fetchAtlasAPI(
    'get',
    `https://bluebrainatlas.kcpdev.bbp.epfl.ch/api/ontologies/brain-regions?atlas_id=${atlasIdUri}`,
    accessToken
  )
    .then((response) => response.json())
    .then((json) =>
      arrayToTree(json, {
        dataField: null,
        parentId: 'parentID',
        childrenField: 'items',
      })
    );
}

async function getBrainRegionById(id: string, accessToken: string) {
  return fetchAtlasAPI(
    'get',
    `https://bluebrainatlas.kcpdev.bbp.epfl.ch/api/ontologies/brain-regions/${id}?atlas_id=${atlasIdUri}&cell_composition_id=https://bbp.epfl.ch/neurosciencegraph/data/cellcompositions/54818e46-cf8c-4bd6-9b68-34dffbc8a68c`,
    accessToken
  ).then((response) => response.json());
}

type HeaderProps = {
  label: string | React.ReactElement;
  icon: React.ReactElement;
};

function Header({ label, icon }: HeaderProps) {
  return (
    <div className="flex space-x-2 justify-start items-center text-2xl text-white font-bold">
      {React.cloneElement(icon, { style: { height: '1em' } })}
      {label}
    </div>
  );
}

type TitleComponentProps = {
  title?: string;
};

function CapitalizedTitle({ title }: TitleComponentProps) {
  return (
    <>
      <AngledArrowIcon
        className={classNames(styles.accordionArrow, 'flex-none')}
        style={{ height: '1em' }}
      />
      <span className="capitalize mr-auto">{title}</span>
    </>
  );
}

function UppercaseTitle({ title }: TitleComponentProps) {
  return (
    <>
      <AngledArrowIcon
        className={classNames(styles.accordionArrow, 'flex-none')}
        style={{ height: '1em' }}
      />
      <span className="uppercase text-lg mr-auto">{title}</span>
    </>
  );
}

function CompositionTitle({ composition, title }: { composition?: number; title?: string }) {
  return (
    <>
      <span className="font-bold whitespace-nowrap">{title}</span>
      <span className="ml-auto pr-2.5 whitespace-nowrap">{composition}</span>
    </>
  );
}

export type Composition = {
  count: number;
  density: number;
};

export type Link = { source: string; target: string; value?: number };

export type Node = {
  about: string;
  glia_composition: Composition;
  id: string;
  label: string;
  neuron_composition: Composition;
};

export type Densities = {
  nodes: Node[];
  links: Link[];
};

type MeTypeDetailsProps = {
  densityOrCount: keyof Composition;
  gliaComposition?: Composition;
  neuronComposition?: Composition;
  nodes: Densities['nodes'];
};

function MeTypeDetails({
  densityOrCount,
  gliaComposition,
  neuronComposition,
  nodes,
}: MeTypeDetailsProps) {
  const neurons = arrayToTree(
    nodes.map(({ neuron_composition, label, ...node }) => ({
      ...node,
      composition: `${(neuron_composition as Composition)[densityOrCount]} neurons`,
      title: label,
    })), // TODO: Refactor TreeNavItem to be property name agnostic
    {
      dataField: null,
      parentId: 'parent_id',
      childrenField: 'items',
    }
  );

  return (
    <>
      <h2 className="flex font-bold justify-between text-white text-lg uppercase">
        Neurons
        <small className="font-normal text-base">
          {neuronComposition && neuronComposition.count}
        </small>
      </h2>
      {neurons && (
        <Accordion.Root collapsible type="single">
          {neurons.map(({ id, items, composition, title }) => (
            <TreeNavItem
              className="py-3 text-primary-3 hover:text-white"
              id={id}
              items={items}
              key={id}
              title={<CompositionTitle composition={composition} title={title} />}
            >
              <TreeNavItem className="pl-3" title={<CompositionTitle />} />
            </TreeNavItem>
          ))}
        </Accordion.Root>
      )}
      <h2 className="flex font-bold justify-between text-white text-lg uppercase">
        Glia
        <small className="font-normal text-base">
          {gliaComposition && gliaComposition.density}
        </small>
      </h2>
    </>
  );
}

export const compositionAtom = atom<Densities>({ links: [], nodes: [] });
export const densityOrCountAtom = atom<keyof Composition>('count');

interface MeTypeDetailsState extends MeTypeDetailsProps {
  colorCode: string;
  distribution: Distribution;
  id: string;
  title: string;
  color_code: string;
}

function BrainRegionSelector() {
  const { data: session } = useSession();
  const [brainRegions, setBrainRegions] = useState<TreeChildren[]>();
  const [meTypeDetails, setMeTypeDetails] = useState<MeTypeDetailsState>();

  const fetchDataAPI = useCallback(() => {
    if (!brainRegions && session?.user) {
      getBrainRegionsTree(session.accessToken).then((tree) =>
        setBrainRegions(tree as TreeChildren[])
      );
    }
  }, [brainRegions, session]);
  const composition = useAtomValue(compositionAtom);
  const setComposition = useSetAtom(compositionAtom);
  const densityOrCount = useAtomValue(densityOrCountAtom);
  const setBrainRegionCallback = useCallback(
    async ({ id }: TreeNavItemCallbackProps) => {
      if (session?.user && id) {
        const {
          title,
          color_code: colorCode,
          composition_details: compositionDetails,
          distribution,
        } = await getBrainRegionById(id, session.accessToken);

        const {
          neuron_composition: neuronComposition,
          glia_composition: gliaComposition,
          nodes,
          links,
        } = compositionDetails || {
          neuron_composition: 0,
          glia_composition: 0,
          nodes: [],
          links: [],
        };

        setMeTypeDetails({
          colorCode,
          distribution,
          gliaComposition, // The total will remain constant for a given brain region
          id,
          neuronComposition, // The total will remain constant for a given brain region
          title,
        } as MeTypeDetailsState);
        setComposition(compositionDetails && { nodes, links });
      }
    },
    [session, setComposition, setMeTypeDetails]
  );

  useEffect(() => fetchDataAPI());

  return !session?.user ? null : (
    <div className="flex">
      <div className="bg-primary-8 flex flex-1 flex-col h-screen">
        <div className="flex flex-1 flex-col overflow-y-auto px-7 py-8 w-[300px]">
          <div className="grid gap-5">
            <Header label={<span>Brain region</span>} icon={<BrainIcon />} />
            <div className="border-b border-white focus-within:border-primary-2">
              <input
                type="text"
                className="block w-full py-3 text-primary-4 placeholder-primary-4 border-0 border-b border-transparent bg-transparent focus:border-primary-4 focus:ring-0"
                disabled
                placeholder="Search region..."
              />
            </div>
            <Accordion.Root className="divide-y divide-primary-7" collapsible type="single">
              {brainRegions &&
                brainRegions.map(({ id, items, title }) => (
                  <TreeNavItem
                    className="font-bold hover:bg-primary-8 hover:text-white py-3 text-primary-4"
                    id={id}
                    items={items}
                    key={id}
                    onValueChange={setBrainRegionCallback} // Will be attached to nested Accordion.Trigger
                    selectedId={meTypeDetails ? meTypeDetails.id : ''}
                    title={<UppercaseTitle title={title} />}
                  >
                    <TreeNavItem className="font-normal pl-3" title={<CapitalizedTitle />} />
                  </TreeNavItem>
                ))}
            </Accordion.Root>
          </div>
        </div>
      </div>
      <div className="bg-primary-7 flex flex-1 flex-col h-screen min-w-[300px] overflow-hidden">
        <div className="flex flex-col overflow-y-auto py-8">
          {meTypeDetails && (
            <div className="grid gap-5 px-7">
              <Header
                label={<span className="text-secondary-4">{meTypeDetails.title}</span>}
                icon={<BrainRegionIcon />}
              />
              {meTypeDetails.distribution ? (
                <span>
                  <BrainRegionMeshTrigger
                    distribution={meTypeDetails.distribution}
                    colorCode={meTypeDetails.colorCode}
                  />
                  <PointCloudTrigger regionID={meTypeDetails.id} color={meTypeDetails.colorCode} />
                </span>
              ) : (
                <Button
                  className={`${styles.buttonTrigger} cursor-not-allowed bg-primary-6 border-none`}
                  icon={<EyeInvisibleFilled className="text-error" />}
                />
              )}
              {composition && (
                <MeTypeDetails
                  densityOrCount={densityOrCount}
                  gliaComposition={meTypeDetails.gliaComposition}
                  neuronComposition={meTypeDetails.neuronComposition}
                  nodes={composition.nodes}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrainRegionSelector;
