'use client';

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-plusplus */
import React from 'react';

import { getLocalStorage, getSessionStorage } from './storage';
import { logError } from '@/util/logger';

export interface AtomicStateStorageOptions<T> {
  id: string;
  guard: (data: unknown) => data is T;
}

type Listener<T> = (value: T) => void;

/**
 * AtomicState is a mix between a React state and an Event.
 * It is useful to make the bridge between React components
 * and smooth canvas animations.
 *
 * Usage:
 * ```
 * const radius = new AtomicState(64);
 *
 * export default function MyCanvas() {
 *   const refPaint = React.useRef<(() => void) | null>(null);
 *   const handleCanvasMount = (canvas: HTMLCanvasElement | null) => {
 *     if (!canvas) return;
 *
 *     if (refPaint.current) radius.removeListener(refPaint.current);
 *     refPaint.current = () => {
 *       const ctx = canvas.getContext('2d');
 *       if (!ctx) throw Error('Unable to create context 2d!');
 *       const w = canvas.width;
 *       const h = canvas.height;
 *       ctx.clearRect(0, 0, w, h);
 *       ctx.beginPath();
 *       ctx.rect(0, 0, radius.value, radius.value);
 *       ctx.fill();
 *     };
 *     radius.addListener(refPaint.current);
 *   };
 *   React.useEffect(
 *     () => () => {
 *       if (refPaint.current) radius.removeListener(refPaint.current);
 *     },
 *     []
 *   );
 *   return <canvas ref={handleCanvasMount} />;
 * }
 * ```
 */
export default class AtomicState<T> {
  private static counter = 0;

  private currentValue: T;

  private readonly listeners = new Set<Listener<T>>();

  private readonly id: string;

  private readonly sessionId = `AtomicState:${(AtomicState.counter++).toString(16)}\r`;

  constructor(initialValue: T, private readonly storage?: AtomicStateStorageOptions<T>) {
    this.currentValue = initialValue;
    this.id = `AtomicState\n${storage?.id ?? 0}`;
    if (storage) this.loadFromStorage();
    else {
      this.restoreSession();
    }
  }

  get value() {
    return this.currentValue;
  }

  set value(value: T) {
    if (value === this.currentValue) return;

    this.currentValue = value;
    if (this.storage) getLocalStorage().setItem(this.id, JSON.stringify(value));
    else this.saveSession(value);
    this.listeners.forEach((listener) => listener(value));
  }

  /**
   * Example:
   * ```
   * const radius = State.radius.useValue()
   * ```
   * @warning This function must be used only in a React component function.
   */
  useValue(): T {
    const [value, setValue] = React.useState(this.currentValue);
    React.useEffect(() => {
      this.listeners.add(setValue);
      return () => {
        this.listeners.delete(setValue);
      };
    }, []);
    return value;
  }

  /**
   * Example:
   * ```
   * const [radius, setRadius] = State.radius.useState()
   * ```
   * @warning This function must be used only in a React component function.
   */
  useState(): [value: T, setValue: (value: T) => void] {
    const [value, setValue] = React.useState(this.currentValue);
    React.useEffect(() => {
      this.listeners.add(setValue);
      return () => {
        this.listeners.delete(setValue);
      };
    }, []);
    return [
      value,
      (v: T) => {
        this.value = v;
      },
    ];
  }

  addListener(listener: Listener<T>) {
    this.listeners.add(listener);
  }

  removeListener(listener: Listener<T>) {
    this.listeners.delete(listener);
  }

  private loadFromStorage() {
    const { storage } = this;
    if (!storage) return;

    try {
      const text = getLocalStorage().getItem(this.id);
      if (!text) return;

      const data: unknown = JSON.parse(text);
      if (!storage.guard(data)) throw Error(`Invalid type!`);

      this.currentValue = data;
    } catch (ex) {
      logError(`Unable to retrieve AtomicState "${storage.id}":`, ex);
    }
  }

  private saveSession(value: T) {
    if (!window) return;

    const text = JSON.stringify(value);
    const hash = computeHash(text);
    getSessionStorage().setItem(this.sessionId, `${hash}${text}`);
  }

  private restoreSession() {
    const content = getSessionStorage().getItem(this.sessionId);
    if (!content) return;

    const hash = content.substring(0, 16);
    const text = content.substring(16);
    if (computeHash(text) !== hash) {
      logError('Atomic state has been corrupted!', this.sessionId);
      return;
    }

    try {
      const data = JSON.parse(text) as T;
      this.value = data;
    } catch (ex) {
      logError('Atomic state is an invalid JSON!', this.sessionId);
    }
  }
}

const DIGITS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function computeHash(content: string): string {
  const digits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < content.length; i++) {
    const c = content.charCodeAt(i);
    digits[i % digits.length] += c;
  }
  return digits.map((v) => DIGITS[v % DIGITS.length]).join('');
}
