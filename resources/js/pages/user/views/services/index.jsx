import React from "react";
import {
    Box,
    Flex,
    Text,
    Card,
    useColorModeValue,
    Heading,
    Accordion,
    AccordionButton,
    AccordionPanel,
    AccordionItem,
    List,
    ListItem
} from "@chakra-ui/react";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function UserReports() {
    const textColor = useColorModeValue('secondaryGray.900', 'white');

    return (
        <Box>
            <Card
                flexDirection="column"
                bgColor={"transparent"}
                w="100%"
                px="0px"
                overflow={'hidden'}
                shadow={"none"}
            >
                <Flex px="25px" mb="8px" flexDirection={"column"} justifyContent="space-between">
                    <Text
                        color={textColor}
                        fontSize={{ md: "34px", base: '24px' }}
                        fontWeight="800"
                        lineHeight="48px"
                        mb={'10px'}
                    >
                        Advertising options and additional services
                    </Text>
                    <Text
                        color={textColor}
                        mt={5}
                        fontSize={{ md: "16px", base: '14px' }}
                        fontWeight="500"
                        lineHeight="150%"
                    >
                        This page describes the services and products DB Rank AI can offer to:
                    </Text>
                    <Heading as={'h2'} fontSize={{ md: '24px', base: '16px' }} lineHeight={'48px'}>
                        A) Vendors of a DBMS:
                    </Heading>

                    <Accordion allowMultiple width="100%" maxW="xl" rounded="xl">
                        <AccordionItem>
                            <AccordionButton
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                p={4}>
                                <Text fontSize="md">Promote your system as a featured product</Text>
                                <MdKeyboardArrowDown fontSize="24px" />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Text color="gray.600">
                                    Featured products appear on all pages in the side area right beside the main content. Your presentation consists of a logo (up to 250x80 pixels) and 4 or 5 lines of text including a link to your landing page
                                </Text>
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionButton
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                p={4}>
                                <Text fontSize="md">Banner advertisement</Text>
                                <MdKeyboardArrowDown fontSize="24px" />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Text color="gray.600">
                                    You can buy the top banner (728x90 pixels) shown on all pages of DB-Engines.com with the following options:
                                </Text>
                                <List listStyleType={'circle'} ml={'15px'}>
                                    <ListItem>
                                        <Text color="gray.600">
                                            presentation on each pageview: the cost is 1,000 Euro per month or 10,000 Euro when booking a full year,
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text color="gray.600">
                                            presentation on 50% of all pageviews, randomly selected: the cost is 600 Euro per month or 6,000 Euro when booking a full year.
                                        </Text>
                                    </ListItem>
                                </List>
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionButton
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                p={4}>
                                <Text fontSize="md">Enhance the presentation of your system</Text>
                                <MdKeyboardArrowDown fontSize="24px" />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Text color="gray.600">
                                The commercial&marketing attributes (blue shaded area in above link) could be edited directly by you including formatted text, pictures and links. To request an account for displaying and self-editing those attributes, please contact us.
                                </Text>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </Flex>
                <Flex px="25px" mb="8px" flexDirection={"column"} justifyContent="space-between">
                    <Text
                        color={textColor}
                        fontSize={{ md: "34px", base: '24px' }}
                        fontWeight="800"
                        lineHeight="48px"
                        mb={'10px'}
                    >
                        General
                    </Text>
                    <Text
                        color={textColor}
                        mt={5}
                        fontSize={{ md: "16px", base: '14px' }}
                        fontWeight="500"
                        lineHeight="150%"
                    >
                        DB Ranking AI currently has approximately 1,000,000 pageviews per month.
                    </Text>
                    <Text
                        color={textColor}
                        mt={5}
                        fontSize={{ md: "16px", base: '14px' }}
                        fontWeight="500"
                        lineHeight="150%"
                    >
                        Listing a featured product or buying an advertisement will have no impact on the DB Ranking AI popularity ranking.
                    </Text>
                    <Text
                        color={textColor}
                        mt={5}
                        fontSize={{ md: "16px", base: '14px' }}
                        fontWeight="500"
                        lineHeight="150%"
                    >
                        All prices are exclusive VAT where applicable.
                    </Text>
                    <Text
                        color={textColor}
                        mt={5}
                        fontSize={{ md: "16px", base: '14px' }}
                        fontWeight="500"
                        lineHeight="150%"
                    >
                        Please contact us at <a href="mailto:office@dbrank.ai"><span style={{ color: '#2b6cb0', textDecoration: 'underline' }}>office@dbrank.ai</span></a>.
                    </Text>
                </Flex>
            </Card>
        </Box >
    );
}
