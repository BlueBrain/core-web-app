import { cloneElement, isValidElement, ReactElement } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
// import { classNames } from '@/util/utils';
import ArrowDownOutlinedIcon from '@/components/icons/ArrowDownOutlined';
import styles from './tree-nav-item.module.css';

export type TreeChildren = {
  id: string;
  items?: TreeChildren[];
  title: string;
  // All other props - https://stackoverflow.com/questions/40032592/typescript-workaround-for-rest-props-in-react
  [x: string]: any;
};

type TreeNavItemProps = {
  children?: ReactElement;
  className?: string;
  id?: any;
  items?: TreeChildren[];
  value?: string[];
  // All other props - https://stackoverflow.com/questions/40032592/typescript-workaround-for-rest-props-in-react
  [x: string]: any;
};

export default function TreeNavItem({
  children,
  className = 'ml-5',
  id,
  items,
  value,
  ...props
}: TreeNavItemProps) {
  return (
    <Accordion.Item value={id} className={className}>
      <>
        <Accordion.Header asChild>
          {isValidElement(children) &&
            cloneElement(
              children as ReactElement,
              { id, ...props },
              items && items.length > 0 && (
                <Accordion.Trigger
                  className={styles.accordionTrigger}
                  data-disabled={!items || items.length === 0}
                >
                  <ArrowDownOutlinedIcon
                    className={styles.accordionChevron}
                    style={{ height: '13px' }}
                  />
                </Accordion.Trigger>
              )
            )}
        </Accordion.Header>
        {items && items.length > 0 && (
          <Accordion.Content asChild>
            <Accordion.Root type="multiple" asChild>
              <>
                {items.map(({ id: itemId, items: nestedItems, ...itemProps }) =>
                  nestedItems ? (
                    <TreeNavItem
                      key={itemId}
                      id={itemId}
                      items={nestedItems}
                      className={className}
                      {...props} // eslint-disable-line react/jsx-props-no-spreading
                      {...itemProps} // eslint-disable-line react/jsx-props-no-spreading
                    >
                      {(children?.props as any).children
                        ? (children?.props as any)?.children
                        : children}
                    </TreeNavItem>
                  ) : (
                    isValidElement(children) &&
                    cloneElement(
                      (children?.props as any)?.children
                        ? (children.props as any)?.children
                        : children,
                      {
                        id: itemId,
                        items: nestedItems,
                        ...itemProps, // eslint-disable-line react/jsx-props-no-spreading
                      }
                    )
                  )
                )}
              </>
            </Accordion.Root>
          </Accordion.Content>
        )}
      </>
    </Accordion.Item>
  );
}
