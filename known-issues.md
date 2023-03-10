# Known issues

This document outlines acknowledged issues with SBO Web app, including workarounds if known.

## Routing

### The usePathname hook from `next/navigation` returns a value containing the basePath.

Which might break the logic if not accounted for. As developers we probably don't want to care about that.
Workaround: custom usePathname hook located at `@/src/hooks/pathway`.

## State

### Broken atom reactivity when using selectAtom and loadable

In some cases using `selectAtom` and `loadable` in the same dependency tree might result in broken
reactivity in production build. This is still being investigated.
TODO: when the issue is further isolated and a simple reproduction is made - submit an issue to Jotai repo.

As a workaround a normal derived atom can be used instead of `selectAtom`.

An example:

```
const idAtom = selectAtom(configAtom, config => config.id);
// becomes
const idAtom = atom(get => get(configAtom).id);
```
