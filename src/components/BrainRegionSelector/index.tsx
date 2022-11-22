import React, { useCallback, useEffect, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { arrayToTree } from 'performant-array-to-tree';
import { useLoginAtomValue } from '@/atoms/login';
import utils from '@/util/utils';
import BrainIcon from '@/components/icons/Brain';
import BrainRegionIcon from '@/components/icons/BrainRegion';
import AngledArrowIcon from '@/components/icons/AngledArrow';
import TreeNavItem from '@/components/tree-nav-item';
import styles from './brain-region-selector.module.css';

const { fetchAtlasAPI, classNames } = utils;

const atlasIdUri =
  'https://bbp.epfl.ch/neurosciencegraph/data/4906ab85-694f-469d-962f-c0174e901885';

function getBrainRegionsTree(accessToken: string) {
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

function getBrainRegionById(id: string, accessToken: string) {
  return fetchAtlasAPI(
    'get',
    `https://bluebrainatlas.kcpdev.bbp.epfl.ch/api/ontologies/brain-regions/${id}?atlas_id=${atlasIdUri}`,
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

type TreeChildren = {
  id: string;
  title: string;
  items?: TreeChildren[];
};

type MeTypeDetailsProps = {
  neurons_density: number;
  neurons_mtypes: {
    e_types?: {
      id: string;
      title: string;
    }[];
    id: string;
    title: string;
  }[];
  glia_cell_types: {
    density: number;
    id: string;
    title: string;
  }[];
  glia_density: number;
};

function MeTypeDetails({
  neurons_density: neuronsDensity,
  neurons_mtypes: neuronMtypes,
  glia_cell_types: gliaCellTypes,
  glia_density: gliaDensity,
}: MeTypeDetailsProps) {
  return (
    <>
      <h2 className="flex font-bold justify-between text-white text-lg uppercase">
        Neurons
        {neuronsDensity && <small className="font-normal text-base">{neuronsDensity}</small>}
      </h2>
      {neuronMtypes && (
        <Accordion.Root collapsible type="single">
          {neuronMtypes.map(({ id, e_types, title }) => (
            <TreeNavItem
              className="hover:text-white py-3 text-blue-3"
              id={id}
              items={e_types}
              key={id}
              title={<span className="font-bold">{title}</span>}
            >
              <TreeNavItem className="pl-3" />
            </TreeNavItem>
          ))}
        </Accordion.Root>
      )}
      <h2 className="flex font-bold justify-between text-white text-lg uppercase">
        Glia
        {gliaDensity && <small className="font-normal text-base">{gliaDensity}</small>}
      </h2>
      {gliaCellTypes && (
        <Accordion.Root collapsible type="single">
          {gliaCellTypes.map(({ density, id, title }) => (
            <TreeNavItem
              className="py-2 text-white"
              id={id}
              key={id}
              title={
                <>
                  <span>{title}</span>
                  {density && <span>{density}</span>}
                </>
              }
            />
          ))}
        </Accordion.Root>
      )}
    </>
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
      <span className="capitalize">{title}</span>
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
      <span className="uppercase text-lg">{title}</span>
    </>
  );
}

type BrainRegion = {
  id: string;
  title: string;
  me_type_details: MeTypeDetailsProps;
};

function BrainRegionSelector() {
  const login = useLoginAtomValue();
  const [data, setData] = useState<TreeChildren[]>();
  const fetchDataAPI = useCallback(() => {
    if (!data && login) {
      getBrainRegionsTree(login.accessToken).then((tree) => setData(tree as TreeChildren[]));
    }
  }, [data, login]);
  const [selectedBrainRegion, setBrainRegion] = useState<BrainRegion>();
  const setSelectedBrainRegion = useCallback(
    async (id: string) => {
      if (login && id) {
        setBrainRegion(await getBrainRegionById(id, login.accessToken));
      }
    },
    [login]
  );

  useEffect(() => fetchDataAPI());

  return !login ? null : (
    <div className="flex">
      <div className="bg-blue-9 h-screen w-12 py-20 flex justify-center items-baseline">
        <div className="text-md font-bold text-white -rotate-90 whitespace-pre">Release 23.01</div>
      </div>
      <div className="bg-blue-8 flex flex-1 flex-col h-screen max-w-[300px]">
        <div className="flex flex-1 flex-col overflow-y-auto px-7 py-8">
          <div className="grid gap-5">
            <Header label={<span>Brain region</span>} icon={<BrainIcon />} />
            <div className="border-b border-white focus-within:border-blue-2">
              <input
                type="text"
                className="block w-full py-3 text-blue-4 placeholder-blue-4 border-0 border-b border-transparent bg-transparent focus:border-blue-4 focus:ring-0"
                disabled
                placeholder="Search region..."
              />
            </div>
            <Accordion.Root
              className="divide-y divide-blue-7"
              collapsible
              onValueChange={setSelectedBrainRegion}
              type="single"
            >
              {data &&
                data.map(({ id, title, items }) => (
                  <TreeNavItem
                    className="font-bold hover:bg-blue-8 hover:text-white py-3 text-blue-4"
                    id={id}
                    items={items}
                    key={id}
                    onValueChange={setSelectedBrainRegion}
                    selectedId={selectedBrainRegion ? selectedBrainRegion.id : ''}
                    title={<UppercaseTitle title={title} />}
                  >
                    <TreeNavItem className="font-normal pl-3" title={<CapitalizedTitle />} />
                  </TreeNavItem>
                ))}
            </Accordion.Root>
          </div>
        </div>
      </div>
      <div className="bg-blue-7 flex flex-1 flex-col h-screen max-w-[300px]">
        <div className="flex flex-1 flex-col overflow-y-auto py-8">
          {selectedBrainRegion && (
            <div className="grid gap-5 px-7">
              <Header
                label={<span className="text-green-4">{selectedBrainRegion.title}</span>}
                icon={<BrainRegionIcon />}
              />
              {
                <MeTypeDetails {...selectedBrainRegion.me_type_details} /> // eslint-disable-line react/jsx-props-no-spreading
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrainRegionSelector;
