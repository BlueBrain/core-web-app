'use client';

import React from 'react';
import GenerativeQAInput from './GenerativeQAInput';
import FilterPanel from './FilterPanel';

function GenerativeQABuilder() {
  return (
    <>
      <GenerativeQAInput />
      <FilterPanel />
    </>
  );
}

export default GenerativeQABuilder;
