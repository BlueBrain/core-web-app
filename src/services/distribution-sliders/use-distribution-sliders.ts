import { SetStateAction, useCallback } from 'react';
import { useAtom } from 'jotai';
import { DistributionSliderSeries } from '@/services/distribution-sliders/types';
import round from '@/services/distribution-sliders/round';
import { selectedSeriesLabelAtom } from '@/state/density-editor';

type SeriesSetter = (update: SetStateAction<DistributionSliderSeries[]>) => void;

export default function useDistributionSliders(
  series: DistributionSliderSeries[],
  setSeries: SeriesSetter,
  decimalPlaces: number = 1
) {
  const [selectedSeriesLabel, setSelectedSeriesLabel] = useAtom<string>(selectedSeriesLabelAtom);

  const recalculatePercentages = useCallback(
    (newValue: number, seriesItem: DistributionSliderSeries) => {
      const labels = series.map((value) => value.label);
      const modifiedSeriesIndex = labels.indexOf(seriesItem.label);
      const newSeries = [...series];
      const oldValue = series[modifiedSeriesIndex].percentage;

      const unlockedSeries = newSeries.filter(
        (item, index) => index !== modifiedSeriesIndex && !item.isLocked
      );
      const freeSeriesTotalPercentage = unlockedSeries.reduce(
        (previousValue, currentValue) => previousValue + currentValue.percentage,
        0
      );

      // There must be other unlocked sliders, otherwise moving it makes no sense
      if (unlockedSeries.length > 0) {
        newSeries[modifiedSeriesIndex].percentage = Math.min(
          newValue,
          freeSeriesTotalPercentage + oldValue
        );
      }

      const lockedSeries = newSeries.filter(
        (item, index) => index === modifiedSeriesIndex || item.isLocked
      );
      const lockedItemsPercentage = lockedSeries.reduce(
        (previousValue, currentValue) => previousValue + currentValue.percentage,
        0
      );

      // To be distributed across others
      const totalDistributablePercentage = 100 - lockedItemsPercentage;

      // Calculate percentage for the remaining series
      let remainingFreePercents = totalDistributablePercentage;
      unlockedSeries.forEach((value, index, array) => {
        const oldPercentage =
          freeSeriesTotalPercentage !== 0 ? value.percentage / freeSeriesTotalPercentage : 0;
        const seriesIndex = labels.indexOf(value.label);
        const newPercentage = round(oldPercentage * totalDistributablePercentage, decimalPlaces);
        newSeries[seriesIndex].percentage = newPercentage;

        remainingFreePercents -= newPercentage;
        if (remainingFreePercents < 0) {
          newSeries[seriesIndex].percentage = round(
            newSeries[seriesIndex].percentage + remainingFreePercents,
            decimalPlaces
          );
          remainingFreePercents = 0;
        } else if (remainingFreePercents !== 0 && index === array.length - 1) {
          newSeries[seriesIndex].percentage = round(
            newSeries[seriesIndex].percentage + remainingFreePercents,
            decimalPlaces
          );
        }
      });

      setSeries(newSeries);
      // @ts-ignore
      setSelectedSeriesLabel(seriesItem.label);
    },
    [decimalPlaces, series, setSeries, setSelectedSeriesLabel]
  );

  const toggleLockSlider = useCallback(
    (seriesItem: DistributionSliderSeries) => {
      const newSeries = [...series];
      const labels = series.map((value) => value.label);
      const modifiedSeriesIndex = labels.indexOf(seriesItem.label);
      const newSeriesItem = { ...newSeries[modifiedSeriesIndex] };
      newSeriesItem.isLocked = !newSeriesItem.isLocked;
      newSeries[modifiedSeriesIndex] = newSeriesItem;
      setSeries(newSeries);
    },
    [series, setSeries]
  );

  return { toggleLockSlider, recalculatePercentages, selectedSeriesLabel };
}
