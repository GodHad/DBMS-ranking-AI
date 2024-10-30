import React, { useState } from 'react';
import {
    Box, SimpleGrid, Heading, Text, Flex, Breadcrumb, BreadcrumbItem, HStack,
    Card as ChakraCard,
    CardHeader,
    CardBody,
    Image,
    Avatar,
    useBreakpointValue, useColorModeValue
} from '@chakra-ui/react';
import Card from "../../../../components/card/Card";
import { getSponsors } from '../../../admin/views/admin/sponsors/requests/use-request';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import {
    Skeleton,
} from "@chakra-ui/skeleton";
import { Helmet } from 'react-helmet';

const SponsorPage = () => {

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    let secondaryText = useColorModeValue('gray.700', 'white');
    const columnCount = useBreakpointValue({
        xs: 1,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
    });

    const { data: sponsors = null, isLoading } = useQuery('sponsors', () => getSponsors(true), { staleTime: 300000 });

    const blogCardBg = useColorModeValue("gray.200", "navy.900");

    const [sponsor, setSponsor] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Helmet>
                <title>DB Rank AI | Sponsors</title>
            </Helmet>
            <Card
                w="100%"
                px="0px"
                minH="calc(100vh - 150px)"
            >
                <Box width={'100%'} px="25px">
                    <Breadcrumb>
                        <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                            <Link to='/'>
                                Home
                            </Link>
                        </BreadcrumbItem>

                        <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px' onClick={() => { setIsOpen(false), setSponsor(null) }}>
                            <Link to='/sponsor'>
                                Sponsor
                            </Link>
                        </BreadcrumbItem>
                        {(isOpen && sponsor) && (
                            <BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
                                <Text>{sponsor.title}</Text>
                            </BreadcrumbItem>
                        )}
                    </Breadcrumb>
                    <Text
                        color={textColor}
                        fontSize="22px"
                        mb="30px"
                        fontWeight="700"
                        lineHeight="100%"
                    >
                        Sponsor
                    </Text>
                    <SimpleGrid columns={columnCount} spacing={4}>
                        {sponsors ? sponsors.map((sponsor, index) => (
                            <ChakraCard maxW="md" key={index} bg={blogCardBg}>
                                <CardHeader>
                                    <Flex spacing="4">
                                        <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                                            <Avatar
                                                bg={"green.600"}
                                                name={sponsor.name}
                                                src={`storage/${sponsor.logo_url}`}
                                            />
                                            <Box>
                                                <a href={sponsor.link} target='_blank'><Heading size="sm">{sponsor.name}</Heading></a>
                                            </Box>
                                        </Flex>
                                    </Flex>
                                </CardHeader>
                                <CardBody>
                                    <Text>
                                        {sponsor.description}
                                    </Text>
                                </CardBody>
                                <Image
                                    h="250px"
                                    w="100%"
                                    borderRadius="xl"
                                    objectFit="cover"
                                    objectPosition="center"
                                    transition="transform 0.2s ease-out"
                                    _hover={{ transform: "scale(1.02)" }}
                                    src={`storage/${sponsor.banner}?w=1400&auto=compression,format`}
                                    alt={sponsor.name}
                                />
                            </ChakraCard>
                        )) : <>
                            <HStack gap="6" maxW="xs" display="flex">
                                <Skeleton height="460px" borderRadius={"21px"} />
                                <Skeleton height="460px" borderRadius={"21px"} />
                                <Skeleton height="460px" borderRadius={"21px"} />
                            </HStack>
                        </>
                        }
                    </SimpleGrid>
                </Box>
            </Card >
        </>
    )
};

export default SponsorPage;
