'use client';

/* eslint-disable no-param-reassign */
import { MorphologyPainter } from '@bbp/morphoviewer';
import { atom, useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';

import {
  DARK_APICAL_DENDRITE,
  DARK_AXON,
  DARK_BACKGROUND,
  DARK_BASAL_DENDRITE,
  DARK_SOMA,
  LIGHT_APICAL_DENDRITE,
  LIGHT_AXON,
  LIGHT_BACKGROUND,
  LIGHT_BASAL_DENDRITE,
  LIGHT_SOMA,
} from '../constants';
import { TypeDef, assertType } from '@/util/type-guards';

const STORAGE_KEY = 'MorphoViewer/settings';

export interface MorphoViewerSettings {
  isDarkMode: boolean;
  /** CSS color for Soma */
  colorSoma: string;
  /** CSS color for BasalDendrite */
  colorBasalDendrite: string;
  /** CSS color for ApicalDendrite */
  colorApicalDendrite: string;
  /** CSS color for Axon */
  colorAxon: string;
}

/**
 * Internally, we store two color palettes: one for dark mode,
 * and one for light mode.
 * But we only expose the current palette and the `darkMode` attribute.
 * @param painter The painter to update when the settings change.
 */
export function useMorphoViewerSettings(
  painter: MorphologyPainter
): [
  settings: MorphoViewerSettings,
  update: (settings: Partial<MorphoViewerSettings>) => void,
  reset: (darkMode?: boolean) => void,
] {
  const [persistentSettings, setPersistentSettings] = useAtom(persistentSettingsAtom);
  const settings = useMemo(() => readSettings(persistentSettings), [persistentSettings]);

  useEffect(
    () => applySettingsToMorphologyPainter(painter, persistentSettings),
    [persistentSettings, painter]
  );

  const update = (value: Partial<MorphoViewerSettings>) => {
    const darkMode = value.isDarkMode ?? persistentSettings.darkMode;
    const newPersistentSettings =
      darkMode === persistentSettings.darkMode
        ? writeSettings({
            ...settings,
            ...value,
          })
        : {
            ...persistentSettings,
            darkMode,
          };
    saveSettings(newPersistentSettings);
    setPersistentSettings(newPersistentSettings);
  };
  const reset = (darkMode?: boolean) => {
    const defaultSettings = makeDefaultSettings();
    if (typeof darkMode === 'boolean') {
      defaultSettings.darkMode = darkMode;
    }
    saveSettings(defaultSettings);
    setPersistentSettings(defaultSettings);
  };

  return [settings, update, reset];
}

interface Palette {
  soma: string;
  basalDendrite: string;
  apicalDendrite: string;
  axon: string;
}

interface PersistentMorphoViewerSettings {
  darkMode: boolean;
  darkColors: Palette;
  lightColors: Palette;
}

function readSettings({
  darkMode,
  darkColors,
  lightColors,
}: PersistentMorphoViewerSettings): MorphoViewerSettings {
  const palette: Palette = darkMode ? darkColors : lightColors;
  return {
    isDarkMode: darkMode,
    colorSoma: palette.soma,
    colorBasalDendrite: palette.basalDendrite,
    colorApicalDendrite: palette.apicalDendrite,
    colorAxon: palette.axon,
  };
}

function writeSettings({
  isDarkMode: darkMode,
  colorSoma,
  colorBasalDendrite,
  colorApicalDendrite,
  colorAxon,
}: MorphoViewerSettings): PersistentMorphoViewerSettings {
  const output = loadSettings();
  output.darkMode = darkMode;
  const palette: Palette = darkMode ? output.darkColors : output.lightColors;
  palette.soma = colorSoma;
  palette.apicalDendrite = colorApicalDendrite;
  palette.basalDendrite = colorBasalDendrite;
  palette.axon = colorAxon;
  return output;
}

const persistentSettingsAtom = atom(loadSettings());

function makeDefaultSettings(): PersistentMorphoViewerSettings {
  return {
    darkMode: false,
    darkColors: {
      soma: DARK_SOMA,
      basalDendrite: DARK_BASAL_DENDRITE,
      apicalDendrite: DARK_APICAL_DENDRITE,
      axon: DARK_AXON,
    },
    lightColors: {
      soma: LIGHT_SOMA,
      basalDendrite: LIGHT_BASAL_DENDRITE,
      apicalDendrite: LIGHT_APICAL_DENDRITE,
      axon: LIGHT_AXON,
    },
  };
}

function assertPersistentMorphoViewerSettings(
  data: unknown
): asserts data is PersistentMorphoViewerSettings {
  const colorsType: TypeDef = {
    soma: 'string',
    basalDendrite: 'string',
    apicalDendrite: 'string',
    axon: 'string',
  };
  assertType(data, {
    darkMode: 'boolean',
    darkColors: colorsType,
    lightColors: colorsType,
  });
}

function loadSettings(): PersistentMorphoViewerSettings {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY) ?? '';
    const data = JSON.parse(item);
    assertPersistentMorphoViewerSettings(data);
    return data;
  } catch (ex) {
    const defaultValue = makeDefaultSettings();
    saveSettings(defaultValue);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultValue));
    return defaultValue;
  }
}

function saveSettings(data: PersistentMorphoViewerSettings) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function applySettingsToMorphologyPainter(
  painter: MorphologyPainter,
  { darkMode, darkColors, lightColors }: PersistentMorphoViewerSettings
) {
  const { soma, basalDendrite, apicalDendrite, axon }: Palette = darkMode
    ? darkColors
    : lightColors;
  const background = darkMode ? DARK_BACKGROUND : LIGHT_BACKGROUND;
  painter.colors.background = background;
  painter.colors.soma = soma;
  painter.colors.basalDendrite = basalDendrite;
  painter.colors.apicalDendrite = apicalDendrite;
  painter.colors.axon = axon;
}
