import React, { useState, useEffect } from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  VStack,
  Box,
  Text,
  Spinner
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useMutation } from "react-query";
import axios from '../../../variables/axiosConfig';
import { generateSlug } from "../../../variables/statics";
import { Link } from "react-router-dom";

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const searchDBMSAndBlogEncyclopedia = async (searchTerm) => {
  const res = await axios.post('/api/search', { searchTerm });
  return res.data;
}

export function SearchBar(props) {
  const { variant, background, children, placeholder, borderRadius, ...rest } =
    props;

  const [loading, setLoading] = useState(false);

  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [searchResult, setSearchResult] = useState({
    dbms: [],
    blog: []
  })

  const searchMutation = useMutation(searchDBMSAndBlogEncyclopedia, {
    onSuccess: (data) => {
      setSearchResult(data);
      setLoading(false)
    }
  })

  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true);
      searchMutation.mutate(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm])

  return (
    <VStack gap={2} position={'relative'}>
      <InputGroup w={{ base: "100%", md: "200px" }} {...rest}>
        <InputLeftElement
          children={
            <IconButton
              bg='inherit'
              borderRadius='inherit'
              _hover='none'
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
              icon={
                <SearchIcon color={searchIconColor} w='15px' h='15px' />
              }></IconButton>
          }
        />
        <Input
          variant='search'
          fontSize='sm'
          bg={background ? background : inputBg}
          color={inputText}
          fontWeight='500'
          _placeholder={{ color: "gray.400", fontSize: "14px" }}
          borderRadius={borderRadius ? borderRadius : "30px"}
          placeholder={placeholder ? placeholder : "Search..."}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
      {searchTerm && (
        (searchResult.blog.length > 0 || searchResult.dbms.length > 0) ? (
          <Box width="300px" borderWidth="1px" borderRadius="md" p={4} position="absolute" top={9} zIndex={10} bg={inputBg}>
            {searchResult.blog.length > 0 && (
              searchResult.blog.map((result, index) => (
                <Link to={`/blog/${result.id}/${generateSlug(result.title)}`} key={`blog-${index}`} onClick={() => setSearchTerm('')}>
                  <Text isTruncated maxWidth="100%">Blog: {result.title}</Text>
                </Link>
              ))
            )}
            {searchResult.dbms.length > 0 && (
              searchResult.dbms.map((result, index) => (
                <Link to={`/dbms/${generateSlug(result.db_name)}`} key={`dbms-${index}`} onClick={() => setSearchTerm('')}>
                  <Text>DBMS: {result.db_name}</Text>
                </Link>
              ))
            )}
          </Box>
        ) : (
          !loading ? (
            <Box width="300px" borderWidth="1px" borderRadius="md" p={4} position="absolute" top={9} zIndex={10} bg={inputBg}>
              <Text>No results</Text>
            </Box>
          ) : (
            <Box width="300px" borderWidth="1px" borderRadius="md" p={4} position="absolute" top={9} zIndex={10} bg={inputBg}>
              <Spinner />
            </Box>
          )
      ))}

    </VStack>
  );
}
