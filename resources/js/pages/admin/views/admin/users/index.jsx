import React from 'react';
import {
    Box,
    TabPanel,
    TabPanels,
    Tabs,
    TabList,
    Tab
} from '@chakra-ui/react';

import Vendor from './vendor';
import Author from './author';

export default function Blog() {
    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Tabs>
                <TabList>
                    <Tab>Vendors</Tab>
                    <Tab>Authors</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Vendor />
                    </TabPanel>
                    <TabPanel>
                        <Author />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box >
    );
}
