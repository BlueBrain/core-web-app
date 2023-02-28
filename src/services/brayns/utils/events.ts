import React from 'react';
import GenericEvent, { GenericEventInterface } from './generic-event';

const Events = {
  /**
   * Helper for hooks depending on events.
   */
  useEvent<T>(event: GenericEventInterface<T>, intialValue: T): T {
    const [value, setValue] = React.useState(intialValue);
    React.useEffect(() => {
      event.addListener(setValue);
      return () => event.removeListener(setValue);
    }, [event]);
    return value;
  },
  /**
   * A log of the current allocation progress.
   */
  allocationProgress: new GenericEvent<string>(),
};

export default Events;
