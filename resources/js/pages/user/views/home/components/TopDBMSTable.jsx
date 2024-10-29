import {
  Flex,
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
// Custom components
import Card from '../../../../../components/card/Card';
import { useQuery } from 'react-query';
import { getVendors } from '../requests/use-request.js';
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/skeleton"

const columnHelper = createColumnHelper();

export default function Vendor() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: vendors } = useQuery('vendors', getVendors, { staleTime: 300000 });

  const columns = [

    columnHelper.accessor('overall_ranking', {
      id: 'current_ranking',
      header: () => (
        <Text
          justifyContent="center"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Rank
        </Text>
      ),
      cell: (info) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue() === '10000000' ? 'N/A' : info.getValue()}
          </Text>
        </div>
      ),
    }),
    columnHelper.accessor('db_name', {
      id: 'db_name',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Name
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('overall_avg_score', {
      id: 'overall_avg_score',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Avg. Score
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue() === '10000000' ? 'N/A' : Number(info.getValue()).toFixed(2)}
        </Text>
      )
    }),
  ];

  const table = useReactTable({
    data: vendors.slice(0, 5) || [],
    columns,
    state: {
      pagination
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    debugTable: true,
  });

  const rowModel = table.getRowModel();

  return (
    <Box
      flexDirection="column"
      w="100%"
      px="0px"
      overflow={'hidden'}
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize={{md: "22px", base: '20px'}}
          mb="4px"
          fontWeight="700"
          lineHeight="100%"
        >
          Top Rated Databases
        </Text>
      </Flex>

      <Box overflowX={'auto'}>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      pe="10px"
                      borderColor={borderColor}
                      cursor="pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Flex
                        justifyContent="space-between"
                        align="center"
                        fontSize={{ sm: '10px', lg: '12px' }}
                        color="gray.400"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: '',
                          desc: '',
                        }[header.column.getIsSorted()] ?? null}
                      </Flex>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {
              !vendors ?
                <Tr>
                  <Td colSpan={3}>
                    <Stack gap="6">
                      <SkeletonText borderRadius={"12px"} />
                      <SkeletonText borderRadius={"12px"} />
                      <SkeletonText borderRadius={"12px"} />
                      <SkeletonText borderRadius={"12px"} />
                      <SkeletonText borderRadius={"12px"} />
                    </Stack>
                  </Td>
                </Tr>
                :
                (rowModel && rowModel.rows.length !== 0) ? 
                  rowModel
                  .rows
                  .map((row) => {
                    return (
                      <Tr key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <Td
                              key={cell.id}
                              fontSize={{ sm: '14px' }}
                              minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                              borderColor="transparent"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </Td>
                          );
                        })}
                      </Tr>
                    );
                  }) : (
                  <Tr>
                    <Td
                      fontSize={{ sm: '14px' }}
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                      borderColor="transparent"
                      colSpan={8}
                    >
                      <Text
                        color={textColor}
                        mb="4px"
                        align={"center"}
                        fontWeight="700"
                        lineHeight="100%"
                      >
                        No Databases
                      </Text>
                    </Td>
                  </Tr>
                )
            }
          </Tbody>
        </Table>
      </Box>
      <Link to="/ranking">
        <Text
          px="25px"
          color={'navy.300'}
          fontSize="12px"
          mb="4px"
          fontWeight="400"
          lineHeight="100%"
        >
          More
        </Text>
      </Link>
    </Box>
  );
}
