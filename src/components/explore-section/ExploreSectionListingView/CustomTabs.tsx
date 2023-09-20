import { ReactNode, useState } from 'react';
import styles from './customTabs.module.scss';

interface TabItem {
  key: string;
  label: string;
  children: ReactNode;
}

function CustomTabs({
  items,
  experimentTypeName,
}: {
  items: TabItem[];
  experimentTypeName: string;
}) {
  const [activeTab, setActiveTab] = useState<string>(experimentTypeName);

  const handleTabClick = (tab: TabItem) => {
    setActiveTab(tab.key);
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, tab: TabItem) => {
    if (event.key === 'Enter' || event.key === 'Space') {
      setActiveTab(tab.key);
    }
  };

  const activeItem = items.find((item) => item.key === activeTab);

  return (
    <div className={styles.listingContainer}>
      <ul className={styles.customTabs}>
        {items.map((item: TabItem) => (
          <li
            key={item.key}
            className={`
              rounded-full w-fit px-4 py-1
              ${
                activeTab === item.key
                  ? 'bg-primary-7 text-white'
                  : 'hover:bg-blue-100 cursor-pointer'
              }`}
            onClick={() => handleTabClick(item)}
            onKeyDown={(event) => handleTabKeyDown(event, item)} // Add this onKeyDown event handler
            role="button" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
            tabIndex={0}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <div className={activeTab === null ? 'hidden' : ''}>{activeItem?.children}</div>
    </div>
  );
}

export default CustomTabs;
