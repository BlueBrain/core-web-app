import dynamic from 'next/dynamic';

/* 
  Since menu height is determined dynamically on mount,
  pre-rendering will show disparate heights for each of 
  the menu elements. Disabling SSR prevents that.
 */
export default dynamic(() => import('./VirtualLabTopMenu'), {
  ssr: false,
  /* Empty space where the Menu will mount to prevent the elements from 'shifting down' once 
  the menu loads */
  loading: () => <div style={{ height: 49 }} />,
});
