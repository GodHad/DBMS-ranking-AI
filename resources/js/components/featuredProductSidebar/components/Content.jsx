import { Box, Flex, Stack, Heading, Image, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { useQuery } from "react-query";
import { getFeaturedProducts } from "../requests/use-request";
import { Link } from "react-router-dom";

// FUNCTIONS

function SidebarContent() {
  const { data: featuredProducts, isLoading } = useQuery('featured_products', getFeaturedProducts);
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Flex direction='column' height='100%' px="8px" borderRadius='30px'>
      <Stack direction='column' mb='auto' mt='8px'>
        <Flex px="10px" mb="8px" justifyContent="space-between" align="center">
          <Text
            color={textColor}
            fontSize="20px"
            fontWeight="700"
            lineHeight="100%"
          >
            Featured Products
          </Text>
        </Flex>
        <Box>
          {
            featuredProducts && featuredProducts.map((product, index) => (
              <FeaturedProduct key={index} product={product} />
            ))
          }
        </Box>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;

function FeaturedProduct({ product }) {
  return (
    <Box
      maxW={'445px'}
      w={'full'}
      // eslint-disable-next-line react-hooks/rules-of-hooks
      bg={useColorModeValue("white", "navy.800")}
      boxShadow={'2xl'}
      rounded={'md'}
      p={6}
      mb={5}
      overflow={'hidden'}>
      <a href={product.link} target="_blank">
        <Box bg={'gray.100'} mt={-6} mx={-6} mb={6} pos={'relative'}>
          <Image
            src={
              `storage/${product.banner}`
            }
            w={"100%"}
            h={"200px"}
            alt="banner"
          />
        </Box>
        <Stack>
          <Heading
            // eslint-disable-next-line react-hooks/rules-of-hooks
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'2xl'}
            textAlign={'center'}
            fontFamily={'body'}>
            {product.title}
          </Heading>
          <Text textAlign={"center"} color={'gray.500'} dangerouslySetInnerHTML={{ __html: product.content }}>
          </Text>
        </Stack>
      </a>
    </Box>
  )
}