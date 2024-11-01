import { Box, Flex, Stack, Image, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useContext } from "react";
import {
  Skeleton,
} from "@chakra-ui/skeleton"
import { FeaturedProductSidebarContext } from "../../../contexts/FeaturedProductsContext";
import { APP_URL } from "../../../variables/statics";

// FUNCTIONS

function SidebarContent() {
  const { featuredProducts } = useContext(FeaturedProductSidebarContext);
  // const { data: featuredProducts, isLoading } = useQuery('featured_products', getFeaturedProducts, { staleTime: 300000 });
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Flex direction='column' height='100%' px="8px" borderRadius='30px' zIndex={1}
    position={'relative'}>
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
            featuredProducts ?
              featuredProducts.length > 0 ?
                featuredProducts.map((product, index) => (
                  <FeaturedProduct key={index} product={product} />
                )) : (
                  <Text
                    color={textColor}
                    mb="4px"
                    align={"center"}
                    fontWeight="700"
                    lineHeight="100%"
                  >
                    No featured products
                  </Text>
                ) : (
                <Stack gap="6" maxW="xs">
                  <Skeleton height="300px" borderRadius={"21px"} />
                  <Skeleton height="300px" borderRadius={"21px"} />
                  <Skeleton height="300px" borderRadius={"21px"} />
                </Stack>
              )
          }
        </Box>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;

function FeaturedProduct({ product }) {
  return (
    <a href={product.link} target="_blank">
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
        <Box bg={'navy.700'} mt={-6} mx={-6} mb={6} pos={'relative'}>
          <Image
            src={APP_URL + `storage/${product.banner}`}
            w={"100%"}
            h={"100px"}
            alt="banner"
            borderRadius="xl"
            objectFit="cover"
            objectPosition="center"
            transition="transform 0.2s ease-out"
            _hover={{ transform: "scale(1.02)" }}
          />
        </Box>
        <Stack>
          {/* <Heading
            // eslint-disable-next-line react-hooks/rules-of-hooks
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'2xl'}
            textAlign={'center'}
            fontFamily={'body'}>
            {product.title}
          </Heading> */}
          <Text textAlign={"center"} color={'gray.500'} dangerouslySetInnerHTML={{ __html: product.content }}>
          </Text>
        </Stack>
      </Box>
    </a>
  )
}