import React from 'react';
import {
    Box,
    TabPanel,
    TabPanels,
    Tabs,
    TabList,
    Tab
} from '@chakra-ui/react';
import Blogs from './components/blogs';
import Categories from './components/categories';
import Tags from './components/tags';

export default function Blog() {
    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Tabs>
                <TabList>
                    <Tab>Blogs</Tab>
                    <Tab>Categories</Tab>
                    <Tab>Tags</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Blogs />
                    </TabPanel>
                    <TabPanel>
                        <Categories />
                    </TabPanel>
                    <TabPanel>
                        <Tags />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box >
    );
}
