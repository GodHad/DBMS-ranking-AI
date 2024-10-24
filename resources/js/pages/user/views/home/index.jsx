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
      <SimpleGrid columns={{ base: 1, lg: 2, xl: 2 }} gap='20px' mb='20px'>
        <Card
          flexDirection="column"
          bgColor={"transparent"}
          w="100%"
          px="0px"
          overflow={'hidden'}
          shadow={"none"}
        >
          <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
            <Text
              color={textColor}
              fontSize="35px"
              fontWeight="700"
              lineHeight="100%"
            >
              DB Ranking AI
            </Text>
          </Flex>
          <FormControl
            h={'200px'}
            display={'flex'}
            alignItems={'center'}
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
                placeholder='Search Database...'
                mb='24px'
                fontWeight='500'
                color='navy.700'
                size='lg'
                borderColor='gray.300' // Make sure border color is light enough
                _placeholder={{ color: 'gray.500' }} // Ensure placeholder color is set
              />
            </InputGroup>
          </FormControl>
        </Card>
        <SimpleGrid columns={{ base: 1 }} gap='20px' mb='20px'>
          <TopDBMSTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
          <RecentBlogs />
        </SimpleGrid>
      </SimpleGrid>
    </Box >
  );
}
