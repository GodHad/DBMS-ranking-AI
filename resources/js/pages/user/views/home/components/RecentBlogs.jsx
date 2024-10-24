import React from 'react';
import {
  Flex,
  Box,
  Image,
  HStack,
  Tag,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import moment from 'moment';

// Custom components
import Card from '../../../../../components/card/Card';
import { getRecentlyBlogs } from '../requests/use-request';

const BlogTags = (props) => {
  const { marginTop = 0, tags } = props

  return (
    <HStack spacing={2} marginTop={marginTop}>
      {tags.map((tag) => {
        return (
          <Tag size={'md'} variant="solid" colorScheme="orange" key={tag}>
            {tag}
          </Tag>
        )
      })}
    </HStack>
  )
}

const BlogAuthor = (props) => {
  return (
    <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
      <Text fontWeight="medium">By {props.name}</Text>
      <Text>—</Text>
      <Text>{props.date}</Text>
    </HStack>
  )
}

export default () => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgGradient = useColorModeValue(
    'radial(orange.600 1px, transparent 1px)',
    'radial(orange.300 1px, transparent 1px)',
  );
  const { data: blogs, isLoadingBlogs } = useQuery('blogs', getRecentlyBlogs);

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
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
      <Box>
        {
          blogs && blogs.map((blog, index) => (
            <Box
              key={index}
              marginTop={{ base: '1', sm: '5' }}
              display="flex"
              flexDirection={{ base: 'column', sm: 'row' }}
              justifyContent="space-between"
            >
              <Box
                display="flex"
                flex="1"
                marginRight="3"
                position="relative"
                alignItems="center">
                <Box
                  width={{ base: '100%', sm: '85%' }}
                  zIndex="2"
                  marginLeft={{ base: '0', sm: '5%' }}
                  marginTop="5%">
                  <Box textDecoration="none" _hover={{ textDecoration: 'none' }}>
                    <Image
                      borderRadius="lg"
                      src={`storage/${blog.featured_images[0].url}`}
                      alt="some good alt text"
                      objectFit="contain"
                    />
                  </Box>
                </Box>
                <Box zIndex="1" width="100%" position="absolute" height="100%">
                  <Box
                    bgGradient={bgGradient}
                    backgroundSize="20px 20px"
                    opacity="0.4"
                    height="100%"
                  />
                </Box>
              </Box>
              <Box
                display="flex"
                flex="1"
                flexDirection="column"
                justifyContent="center"
                marginTop={{ base: '3', sm: '0' }}>
                <BlogTags tags={blog.tags.map(tag => tag.name)} />
                <Heading marginTop="1">
                  <Text fontSize={'24px'} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                    {blog.title}
                  </Text>
                </Heading>
                <BlogAuthor name={`${blog.user.name} ${blog.user.surname ? blog.user.surname : ''}`} date={moment(blog.created_at).format('D MMMM YYYY')} />
                {/* <div dangerouslySetInnerHTML={{__html: blog.content}} /> */}
              </Box>
            </Box>
          ))
        }
      </Box>
    </Card>
  )
}