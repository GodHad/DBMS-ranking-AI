import React from 'react';
import { Box, Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import Vendors from './components/vendors';
import Requests from './components/requests'

export default function Sponsor() {

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            {/* <Tabs>
                <TabList>
                    <Tab>Vendors</Tab>
                    <Tab>Request</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel> */}
                        <Vendors />
                    {/* </TabPanel>
                    <TabPanel>
                        <Requests />
                    </TabPanel>
                </TabPanels>
            </Tabs> */}
        </Box >
    );
}
