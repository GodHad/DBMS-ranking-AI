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
import { Helmet } from "react-helmet";

export default function UserReports() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <>
      <Helmet>
        <title>DBMS Ranking AI</title>
      </Helmet>
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
                fontSize={{ md: "40px", base: '34px' }}
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
                fontSize={{ md: "18px", base: '16px' }}
                fontWeight="500"
                lineHeight="200%"
              >
                DB Ranking AI is an initiative to collect and present information on database management systems (DBMS). In addition to established relational DBMS, systems and concepts of the growing NoSQL area are emphasized.
              </Text>
              <Text
                color={textColor}
                mt={2}
                fontSize={{ md: "18px", base: '16px' }}
                fontWeight="500"
                lineHeight="200%"
              >
                The DB Ranking is a list of DBMS ranked by their current popularity. The list is updated weekly.
              </Text>
            </Flex>
          </Card>
          <TopDBMSTable />
        </SimpleGrid>
        <RecentBlogs />
      </Box >
    </>
  );
}
