import {
  Avatar,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Select,
  Menu,
  Text,
  SimpleGrid,
  Card,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";
import { MdSearch } from "react-icons/md";
import React from "react";
import TopDBMSTable from "./components/TopDBMSTable";
import RecentBlogs from "./components/RecentBlogs";
import {
  columnsDataCheck,
} from "./variables/columnsData";
import tableDataCheck from "./variables/tableDataCheck.json";

export default function UserReports() {
  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, lg: 2, xl: 2 }} gap='20px' mb='20px' justifyContent={"center"} alignItems={"center"}>
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
              lineHeight="150%"
            >
              DB Ranking AI is an initiative to collect and present information on database management systems (DBMS). In addition to established relational DBMS, systems and concepts of the growing NoSQL area are emphasized.
            </Text>
            <Text
              color={textColor}
              mt={2}
              fontSize="18px"
              fontWeight="500"
              lineHeight="150%"
            >
              The DB Ranking is a list of DBMS ranked by their current popularity. The list is updated weekly.
            </Text>
            <FormControl
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
            </FormControl>
          </Flex>
        </Card>
        <TopDBMSTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
      </SimpleGrid>
      <RecentBlogs />
    </Box >
  );
}
