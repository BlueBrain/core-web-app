import { useLoginAtomValue } from '@/atoms/login';
import React, { useCallback, useEffect, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { arrayToTree } from 'performant-array-to-tree';
import utils from '@/util/utils';
import BrainIcon from '@/components/icons/Brain';
import AngledArrowIcon from '@/components/icons/AngledArrow';
import BrainRegionIcon from '@/components/icons/BrainRegion';
import ArrowDownOutlinedIcon from '@/components/icons/ArrowDownOutlined';

const { classNames, fetchAtlasAPI } = utils;

const atlasIdUri =
  'https://bbp.epfl.ch/neurosciencegraph/data/4906ab85-694f-469d-962f-c0174e901885';

type HeaderProps = {
  label: string | React.ReactElement;
  icon: React.ReactElement;
};

function Header({ label, icon }: HeaderProps) {
  return (
    <div className="flex space-x-2 justify-start items-center text-2xl text-white font-bold">
      {icon}
      {label}
    </div>
  );
}

function Search() {
  return (
    <div className="border-b border-white focus-within:border-blue-2">
      <input
        type="text"
        className="block w-full py-3 text-blue-4 text-base placeholder-blue-4 border-0 border-b border-transparent bg-transparent focus:border-blue-4 focus:ring-0"
        disabled
        placeholder="Search region..."
      />
    </div>
  );
}

interface TreeChildren {
  id: string;
  title: string;
  items?: TreeChildren[];
}

type NavItemProps = {
  className?: string;
  id?: any;
  items?: TreeChildren[];
  onChange?: Function;
  prefix?: React.ReactElement;
  selectedId?: string;
  title: string | React.ReactElement;
};

// This component renders recursively.
// If items prop is provided, it will render the items as <NavItems/>.
// Otherwise, it renders only the <Accordion.Header/> portion.
function NavItem({
  className = '',
  items,
  id,
  onChange, // A callback, from <SidebarGroup/>
  prefix,
  selectedId, // State value, from <SidebarGroup/>
  title,
}: NavItemProps) {
  return (
    <Accordion.Item value={id}>
      <Accordion.Header
        className={classNames(
          'flex items-center py-3 text-blue-4 hover:bg-blue-8 accordion-header',
          className,
          selectedId === id ? 'is-active' : ''
        )}
      >
        {prefix}
        {items && items.length > 0 ? (
          <Accordion.Trigger className="w-full flex justify-between items-center text-left accordion-trigger">
            {title}
            <ArrowDownOutlinedIcon className="accordion-chevron" style={{ height: '13px' }} />
          </Accordion.Trigger>
        ) : (
          <button
            type="button"
            className="bg-transparent text-left text-base"
            disabled={!onChange}
            onClick={() => onChange && onChange(id)}
          >
            {title}
          </button>
        )}
      </Accordion.Header>
      {items && items.length > 0 && (
        <Accordion.Content className="pl-3 divide-y divide-blue-7">
          <Accordion.Root
            collapsible
            type="single"
            onValueChange={(value) => onChange && onChange(value)}
          >
            {items.map(({ id: treeItemId, ...props }) => (
              <NavItem
                className="text-base"
                id={treeItemId}
                key={treeItemId}
                onChange={onChange}
                prefix={prefix}
                selectedId={selectedId}
                {...props} // eslint-disable-line react/jsx-props-no-spreading
              />
            ))}
          </Accordion.Root>
        </Accordion.Content>
      )}
    </Accordion.Item>
  );
}

type BrainRegionsTreeProps = {
  data: TreeChildren[];
  onChange: Function;
  selectedId?: string;
};

function BrainRegionsTree({ data, onChange, selectedId }: BrainRegionsTreeProps) {
  return (
    <Accordion.Root
      className="space-y-0 divide-y divide-blue-7"
      collapsible
      type="single"
      onValueChange={(value) => onChange(value)}
    >
      {data &&
        data.map(({ id, title, ...props }) => (
          <NavItem
            className="font-bold"
            id={id}
            key={id}
            onChange={onChange}
            prefix={
              <AngledArrowIcon
                className="flex-none mr-2 accordion-arrow"
                style={{ height: '1em' }}
              />
            }
            selectedId={selectedId} // Used for setting the "is-active" style for items with no nested items.
            title={<span className="uppercase text-lg">{title}</span>}
            {...props} // eslint-disable-line react/jsx-props-no-spreading
          />
        ))}
    </Accordion.Root>
  );
}

type BrainRegionDetailsProps = {
  title: string;
  me_type_details: {
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
};

function BrainRegionDetails({ title, me_type_details: meTypeDetails }: BrainRegionDetailsProps) {
  const {
    neurons_density: neuronsDensity,
    neurons_mtypes: neuronsMtypes,
    glia_cell_types: gliaCellTypes,
    glia_density: gliaDensity,
  } = meTypeDetails;

  return (
    <div className="grid gap-5">
      <Header
        label={<span className="text-green-4">{title}</span>}
        icon={<BrainRegionIcon style={{ height: '1em' }} />} // Style attribute necessary for scaling SVG to font-size
      />
      {(neuronsDensity || neuronsMtypes) && (
        <div>
          <h2 className="flex justify-between text-white text-lg font-bold uppercase">
            Neurons
            {neuronsDensity && <small className="font-normal text-base">{neuronsDensity}</small>}
          </h2>
          <Accordion.Root className="space-y-0 divide-y divide-blue-7" collapsible type="single">
            {neuronsMtypes &&
              neuronsMtypes.map(({ id, e_types, title: mtypeTitle }) => (
                <NavItem
                  className="font-bold"
                  id={id}
                  items={e_types}
                  key={id}
                  title={mtypeTitle}
                />
              ))}
          </Accordion.Root>
        </div>
      )}
      {(gliaCellTypes || gliaDensity) && (
        <div>
          <h2 className="flex justify-between text-white text-lg font-bold uppercase">
            Glia
            {gliaDensity && <small className="font-normal text-base">{gliaDensity}</small>}
          </h2>
          <Accordion.Root className="space-y-0 divide-y divide-blue-7" collapsible type="single">
            {gliaCellTypes &&
              gliaCellTypes.map(({ id, ...props }) => (
                <NavItem
                  key={id}
                  id={id}
                  {...props} // eslint-disable-line react/jsx-props-no-spreading
                />
              ))}
          </Accordion.Root>
        </div>
      )}
    </div>
  );
}

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

function SidebarGroup() {
  const login = useLoginAtomValue();

  const [data, setData] = useState<any>();

  const fetchDataAPI = useCallback(() => {
    if (!data && login) {
      getBrainRegionsTree(login.accessToken).then((tree) => setData(tree));
    }
  }, [data, login]);

  useEffect(() => fetchDataAPI());

  const [selectedBrainRegion, setBrainRegion] = useState<any>(null);

  // This callback will be used as the onValueChange prop for each rendered <Accordion.Root />
  const setSelectedBrainRegion = useCallback(
    async (id: string) => {
      if (login && id) {
        setBrainRegion(await getBrainRegionById(id, login.accessToken));
      }
    },
    [login]
  );

  if (!login) {
    return null;
  }

  return (
    <div className="flex">
      <div className="bg-blue-9 h-screen w-12 py-6 flex justify-center items-baseline">
        <div className="text-md font-bold text-white" style={{ writingMode: 'sideways-lr' }}>
          Release 23.01
        </div>
      </div>
      <div className="bg-blue-8 flex flex-1 flex-col h-screen max-w-xs ">
        <div className="flex flex-1 flex-col overflow-y-auto px-7 py-8">
          <div className="grid gap-5">
            <Header
              label={<span>Brain region</span>}
              icon={<BrainIcon style={{ height: '1em' }} />} // Style attribute necessary for scaling SVG to font-size
            />
            <Search />
            {data && (
              <BrainRegionsTree
                data={data}
                onChange={setSelectedBrainRegion}
                selectedId={selectedBrainRegion ? selectedBrainRegion.id : ''} // Needed for "active" state of nav items
              />
            )}
          </div>
        </div>
      </div>
      <div className="bg-blue-7 flex flex-1 flex-col h-screen max-w-xs">
        <div className="flex flex-1 flex-col overflow-y-auto px-7 py-8">
          {selectedBrainRegion && (
            <BrainRegionDetails
              {...selectedBrainRegion} // eslint-disable-line react/jsx-props-no-spreading
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SidebarGroup;
