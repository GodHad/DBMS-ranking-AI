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
// Custom components
import Card from '../../../../../components/card/Card';
import { getRecentlyBlogs } from '../requests/use-request';
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/skeleton"

function generateSlug(title) {
  return title
      .toLowerCase()                  // Convert to lowercase
      .trim()                         // Remove whitespace from both ends
      .replace(/[\s\W-]+/g, '-')      // Replace spaces and non-word characters with hyphens
      .replace(/^-+|-+$/g, '');       // Remove leading and trailing hyphens
}

export default () => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgGradient = useColorModeValue(
    'radial(orange.600 1px, transparent 1px)',
    'radial(orange.300 1px, transparent 1px)',
  );
  const blogCardBg = useColorModeValue("gray.200", "navy.900");
  const { data: blogs, isLoadingBlogs } = useQuery('blogs', getRecentlyBlogs, {staleTime: 300000});
  return (
    <Box
      flexDirection="column"
      w="100%"
      px="10px"
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          mb="4px"
          fontWeight="700"
          lineHeight="100%"
        >
          Recently Blogs
        </Text>
        {/* <Menu /> */}
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
                      size="md"
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
                        {/* <Avatar name={`${blog.user.name} ${blog.user.surname ? blog.user.surname : ''}`} size="sm" /> */}
                        <Text>{`By ${blog.user.name} ${blog.user.surname ? blog.user.surname : ''} on ${moment(blog.created_at).format('MMM D, YYYY')}`}</Text>
                      </Flex>
                      <Flex
                        display={"flex"}
                        justify={'start'}

                        gap={1}
                      >
                        {blog.tags &&
                          blog.tags.slice(0, 2).map((category) => (
                            <Tag key={category.name} color="white" bgColor="blue.400" _dark={{ bgColor: "green.500" }}>{category.name}</Tag>
                          ))}
                        {blog.tags.length > 2 && <Text>{`+${blog.tags.length - 2}`}</Text>}
                      </Flex>
                    </Flex>

                    <Flex justify="space-between" fontWeight="medium" color="blue.400" _dark={{ color: "green.200" }}>
                      <Link to={`/blog/${blog.id}/${generateSlug(blog.title)}`}>
                        <Flex align="center">
                          <Text>Read article</Text>
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