import React from 'react';
import {
  Flex,
  Box,
  Image,
  HStack,
  Tag,
  Heading,
  Text,
  SimpleGrid,
  useColorModeValue,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { ArrowRightIcon } from "@chakra-ui/icons";
import Card from '../../../../../components/card/Card';
import { getRecentlyBlogs } from '../requests/use-request';
import {
  Skeleton,
} from "@chakra-ui/skeleton"

function generateSlug(title) {
  return title
      .toLowerCase()
      .trim()       
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');
}

export default () => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const blogCardBg = useColorModeValue("gray.200", "navy.900");
  const { data: blogs } = useQuery('blogs', getRecentlyBlogs, {staleTime: 300000});
  return (
    <Box
      flexDirection="column"
      w="100%"
      px="10px"
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize={{md: "22px", sm: '20px'}}
          mb="4px"
          fontWeight="700"
          lineHeight="100%"
        >
          Recently Blogs
        </Text>
      </Flex>
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap='20px' mb='20px' justifyContent={"center"}>
        {
          !(blogs && blogs.data) ?
            <HStack gap="6" maxW="xs" display="flex">
              <Skeleton height="460px" borderRadius={"21px"} />
              <Skeleton height="460px" borderRadius={"21px"} />
              <Skeleton height="460px" borderRadius={"21px"} />
            </HStack>
            :
            blogs.data.length > 0 ? blogs.data.map((blog, index) => (
              !blog ? <></> :
                <Card h={'100%'} display="flex" flexDir={"column"} justifyContent={"space-between"} bg={blogCardBg} key={index}>
                  <Box>
                    <ChakraLink href={`/blog/${blog.id}/${generateSlug(blog.title)}`}>
                      <Image
                        mb={5}
                        h="200px"
                        w="100%"
                        borderRadius="xl"
                        objectFit="cover"
                        objectPosition="center"
                        transition="transform 0.2s ease-out"
                        _hover={{ transform: "scale(1.02)" }}
                        src={`storage/${blog.featured_images[0].url}?w=1400&auto=compression,format`}
                        alt={blog.title}
                      />
                    </ChakraLink>
                    <Heading
                      as="h2"
                      pb={3}
                      fontSize={{md: '18px', base: '16px'}}
                      fontWeight="semibold"
                      color="gray.800"
                      _dark={{ color: "gray.200" }}
                    >
                      <Link to={`/blog/${blog.id}/${generateSlug(blog.title)}`}>{blog.title}</Link>
                    </Heading>
                  </Box>

                  <Box>
                    <Flex direction={"column"} justify="space-between" mb={4} gap={2}>
                      <Flex align="center" color="gray.500" _dark={{ color: "gray.400" }}>
                        <Text fontSize={{md: '16px', base: '14px'}}>{`By ${blog.user.name} ${blog.user.surname ? blog.user.surname : ''} on ${moment(blog.created_at).format('MMM D, YYYY')}`}</Text>
                      </Flex>
                      <Flex
                        display={"flex"}
                        justify={'start'}

                        gap={1}
                      >
                        {blog.tags &&
                          blog.tags.slice(0, 2).map((category) => (
                            <Tag key={category.name} color="white" bgColor="blue.500" _dark={{ bgColor: "green.500" }}>{category.name}</Tag>
                          ))}
                        {blog.tags.length > 2 && <Text>{`+${blog.tags.length - 2}`}</Text>}
                      </Flex>
                    </Flex>

                    <Flex justify="space-between" fontWeight="medium" color="blue.500" _dark={{ color: "green.200" }}>
                      <Link to={`/blog/${blog.id}/${generateSlug(blog.title)}`}>
                        <Flex align="center">
                          <Text fontSize={{md: '16px', base: '14px'}}>Read article</Text>
                          <ArrowRightIcon w={4} h={4} mx={2} />
                        </Flex>
                      </Link>
                    </Flex>
                  </Box>
                </Card>
            )) : (
              <Text
                color={textColor}
                mb="4px"
                align={"center"}
                fontWeight="700"
                lineHeight="100%"
              >
                No recently blogs
              </Text>
            )}
      </SimpleGrid>
    </Box>
  )
}