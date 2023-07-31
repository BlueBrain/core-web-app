'use client';

import React from 'react';
import Drawer from 'antd/lib/drawer';
import useLiteratureAtom from './state';

type TFilterPanelProps = {
    open: boolean;
    closeFilterPanel(value: boolean): void;
}
export default function FilterPanel({ open, closeFilterPanel }: TFilterPanelProps) {
    const update = useLiteratureAtom();
    const onClose = () => closeFilterPanel(false);


    return (
        <Drawer
            // mask
            // destroyOnClose
            // maskClosable
            // open={open}
            // onClose={onClose}
            // closeIcon={false}
        >

        </Drawer>
    )
}