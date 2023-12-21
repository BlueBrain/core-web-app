# Code conventions

This document aims to cover all the code conventions we want to follow and are not yet covered by the linter/formatter.

The goal is to agree on common ground and try to make the linter check all this for us. So we can focus on more critical points in our code reviews.

## Casing

What case do we use?

* File names:
  * components:
    * folder: pascal (ex.: `BrainConfigPanel`)
    * file: pascal (ex.: `VirtalLabLabel.tsx`)
    * stylesheet: kebab (ex.: `virtual-lab-label.module.css`)
  * others: camel or kebab (ex.: `placeholderReplacer.ts` or `m-model.ts`)
* Routes: defined by the folder hierarchy inside `src/app/` folder.
  * path: kebab (ex.: `experiment-designer/stimulation-protocol`)
  * params (inside square brakets): camel (ex.: `virtual-lab/lab/[virtualLabId]`)

## Ordering

* imports: there is already a linter rule for imports ordering, but nothing for the grouping. Do we want to skip a line between external and internal imports, between aliases and non-aliases, etc...
* components props: do we want to order the props of a component? Do we want an aplhabetical order, no order at all, pushing the optional props to the end, ...

## Imports

What do we prefer?

```ts
import React from `react`
import NextAuth from 'next-auth/react'

export function MyComponent() {
    const session = NextAuth.useSession()
    const [value, setValue] = React.useState(0)
    React.useEffect(...)
}
```

or

```ts
import { useState, useEffect } from `react`
import { useSession } from 'next-auth/react'

export function MyComponent() {
    const session = useSession()
    const [value, setValue] = useState(0)
    useEffect(...)
}
```

## Spacing

Do we need extra rules to add new lines after/before return or useEffect or anything else?

## Private modules

There is no private module in javascript yet, but it possible to adopt the following convention.

When a folder provides an `index.ts` (or `index.tsx`) file, we should not import any file inside this folder because they are not meant for public usage outside this folder.
The index file should export everything the rest of the code can access.
