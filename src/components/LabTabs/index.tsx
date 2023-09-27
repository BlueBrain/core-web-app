import TopNavigation from '@/components/TopNavigation';

export default function BrainFactoryTabs() {
  return (
    <div className="flex w-full">
      <TopNavigation.Main />

      <TopNavigation.PrimaryDropdown
        items={[
          {
            label: 'Cell composition',
            href: '/build/cell-composition/interactive',
            baseHref: '/build/cell-composition',
          },
          {
            label: 'Cell model assignment',
            href: '/build/cell-model-assignment',
            baseHref: '/build/cell-model-assignment',
          },
          {
            label: 'Connectome definition',
            href: '/build/connectome-definition/configuration/macro',
            baseHref: '/build/connectome-definition',
          },
          {
            label: 'Connectome model assignment',
            href: '/build/connectome-model-assignment/configuration',
            baseHref: '/build/connectome-model-assignment',
          },
        ]}
      />
    </div>
  );
}
