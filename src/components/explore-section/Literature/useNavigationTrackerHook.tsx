import { useEffect } from 'react';

type TNavigationItem = {
  listItem: HTMLDivElement;
  anchor: HTMLAnchorElement | null;
  target: HTMLElement | null;
};
type TNavigationItemFiltered = {
  [T in keyof TNavigationItem]: NonNullable<TNavigationItem[T]>;
} & {
  pathStart: number;
};

const TOP_MARGIN = 0.1;
const BOTTOM_MARGIN = 0.2;

function useNavigationTracker({ startNavigationHighLight }: { startNavigationHighLight: boolean }) {
  useEffect(() => {
    const navigation = document.getElementById('gqa-navigation');
    const gqaMarker = document.getElementById('gqa-marker');
    let navigationItems: TNavigationItem[] = [];
    let navigationItemsFiltered: TNavigationItemFiltered[] = [];

    function syncTracker() {
      const windowHeight = window.innerHeight;

      navigationItemsFiltered.forEach((item) => {
        const targetBounds = item.target.getBoundingClientRect();
        if (
          targetBounds.bottom > windowHeight * TOP_MARGIN &&
          targetBounds.top < windowHeight * (1 - BOTTOM_MARGIN)
        ) {
          item.listItem.classList.add('font-extrabold');
        } else {
          item.listItem.classList.remove('font-extrabold');
        }
      });
    }
    function higlightTraker() {
      const navigationItemsElemens: HTMLDivElement[] = Array.from(
        navigation?.querySelectorAll('div.gqa-nav-item') ?? []
      );
      // Cache element references and measurements
      navigationItems = navigationItemsElemens.map((item) => {
        const anchor = item.querySelector('a');
        const href = anchor?.getAttribute('href')?.slice(1);
        const target = href ? document.getElementById(href) : null;

        return {
          anchor,
          target,
          listItem: item,
        };
      });
      // @ts-ignore
      navigationItemsFiltered = navigationItems.filter((item) => !!item.target && !!item.anchor);
      navigationItemsFiltered.forEach((item) => {
        const x = item.anchor.offsetLeft - 5;
        const y = item.anchor.offsetTop;
        const height = item.anchor.offsetHeight;
        gqaMarker?.setAttribute('x', x.toString());
        gqaMarker?.setAttribute('y', y.toString());
        gqaMarker?.setAttribute('height', height.toString());
      });
      syncTracker();
    }

    if (startNavigationHighLight) {
      higlightTraker();
    }

    window.addEventListener('resize', higlightTraker, false);
    window.addEventListener('scroll', syncTracker, false);

    return () => {
      window.removeEventListener('resize', higlightTraker, false);
      window.removeEventListener('scroll', syncTracker, false);
    };
  }, [startNavigationHighLight]);
}

export default useNavigationTracker;
