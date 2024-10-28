import React, { useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  SimpleGrid,
  Card,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import TopDBMSTable from "./components/TopDBMSTable";
import RecentBlogs from "./components/RecentBlogs";
import { useQuery } from "react-query";
import { getBanners } from "../../../admin/views/admin/banner/requests/use-request";
import { APP_URL } from "../../../../variables/statics";

export default function UserReports() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const { data: banners, isLoadingBanner } = useQuery('banners', getBanners, { staleTime: 100000 });

  const bottomBanners = useMemo(() => {
    return banners ? banners.filter(banner => banner.type === 1) : [];
  }, [banners]);

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, lg: 2, xl: 2 }} gap='20px' mb='20px' justifyContent={"center"}>
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
              fontSize="40px"
              fontWeight="800"
              lineHeight="48px"
              mb={'10px'}
              bgClip="text"
              bgGradient={"linear(to-r, #2ac349, #018cc1)"}
            >
              DB Ranking AI
            </Text>
            <Text
              color={textColor}
              mt={5}
              fontSize="18px"
              fontWeight="500"
              lineHeight="200%"
            >
              DB Ranking AI is an initiative to collect and present information on database management systems (DBMS). In addition to established relational DBMS, systems and concepts of the growing NoSQL area are emphasized.
            </Text>
            <Text
              color={textColor}
              mt={2}
              fontSize="18px"
              fontWeight="500"
              lineHeight="200%"
            >
              The DB Ranking is a list of DBMS ranked by their current popularity. The list is updated weekly.
            </Text>
            {/* <FormControl
              display={'flex'}
              alignItems={'center'}
              mt={10}
            >
              <InputGroup display={'flex'} alignItems={'center'}>
                <InputLeftElement mt={1}>
                  <Icon as={MdSearch} color={'navy.700'} size={'lg'} />
                </InputLeftElement>
                <Input
                  fontSize='md'
                  ms={{ base: "0px", md: "0px" }}
                  p={4} // Adjust padding
                  pl={8}
                  type='text'
                  bgColor='white'
                  placeholder='Search...'
                  mb='24px'
                  fontWeight='500'
                  color='navy.700'
                  size='lg'
                  borderColor='gray.300' // Make sure border color is light enough
                  _placeholder={{ color: 'gray.500' }} // Ensure placeholder color is set
                />
              </InputGroup>
            </FormControl> */}
          </Flex>
        </Card>
        <TopDBMSTable />
      </SimpleGrid>
      <RecentBlogs />
      {bottomBanners.map((image, index) => (
        <a href={image.link} target='_blank'>
          <Image
            key={image.id + image.url}
            mb={5}
            h="90px"
            maxW="100%"
            w="100%"
            borderRadius="xl"
            objectFit="cover"
            objectPosition="center"
            src={`${APP_URL}storage/${image.url}?w=1400&auto=compression,format`}
            alt={image.url}
          />
        </a>
      ))}
    </Box >
  );
}
