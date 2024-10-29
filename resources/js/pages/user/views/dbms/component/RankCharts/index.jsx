import {
    Box,
    Flex,
    Icon,
    Text,
    Stack,
    useColorModeValue,
    useBreakpointValue
} from "@chakra-ui/react";
// Custom components
import Card from "../../../../../../components/card/Card";
import LineChart from "../../../../../../components/charts/LineChart";
import React, { useEffect, useState } from "react";
import { MdOutlineCalendarToday } from "react-icons/md";

import axios from "../../../../../../variables/axiosConfig";
import { useQuery } from "react-query";
import {
    Skeleton,
    SkeletonCircle,
    SkeletonText,
} from "@chakra-ui/skeleton";

const getTrendsDataAndXaxisValue = async (country) => {
    const res = await axios.get(`/api/get-trends-data-for-chart?country=${country}`);
    return res.data;
}

export default function RankChart(props) {
    const { showingCategory, country } = props;
    const legendPosition = useBreakpointValue({ base: 'bottom', md: 'right' });
    const [loading, setLoading] = useState(true);
    const textColorSecondary = useColorModeValue("secondaryGray.600", "white");

    const [lineChartDataTotalSpent, setLineChartDataTotalSpent] = useState([{ name: "Sample", data: [0, 10, 20, 30, 40, 50], }]);
    const [lineChartOptionsTotalSpent, setLineChartOptionsTotalSpent] = useState({
        tooltip: {
            theme: "dark",
        },
        chart: {
            toolbar: {
                show: true,
            },
            height: 650,
            type: "line",
            id: "areachart-2",
        },
        legend: {
            showing: true,
            position: legendPosition,
            labels: {
                colors: "#A3AED0",
                fontSize: "12px",
                fontWeight: "500",
            }
            // tooltipHoverFormatter: function (val, opts) {
            //     return val + ' - <strong>' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '</strong>'
            // }
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            padding: {
                right: 30,
                left: 20,
            },
        },

        labels: [],
        xaxis: {
            type: "datetime",
            labels: {
                style: {
                    colors: "#A3AED0",
                    fontSize: "12px",
                    fontWeight: "500",
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#A3AED0",
                    fontSize: "12px",
                    fontWeight: "500",
                },
            },
        },
        stroke: {
            width: 3,
            curve: 'smooth'
        }
    });

    const { data, isLoading } = useQuery(
        ['getTrends', country],
        () => getTrendsDataAndXaxisValue(country.value),
        {
            enabled: !!country,
            staleTime: 300000
        }
    );

    useEffect(() => {
        if (data && data.success) {
            const chartIds = data.chartData.map(_ => _.primary_category.map(category => category.id));
            const chartData = showingCategory === 0 ? data.chartData : data.chartData.filter((_, index) => chartIds[index].includes(showingCategory))
            setLineChartOptionsTotalSpent(prevState => ({
                ...prevState,
                labels: data.xaxis || ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB"]
            }))
            setLineChartDataTotalSpent(chartData || [{ name: "Sample", data: [0, 10, 20, 30, 40, 50], }]);
            setLoading(false);
        }
    }, [data, showingCategory])

    return (
        <Box>
            <Card
                justifyContent='center'
                align='center'
                direction='column'
                w='100%'
                mb='0px'
            >
                <div style={{ display: 'flex', justifyContent: "space-between", marginTop: '20px', marginLeft: '20px', alignItems: 'center' }}>
                    <Text
                        fontSize='sm'
                        fontWeight='500'
                        color={textColorSecondary}
                        borderRadius='7px'>
                        <Icon
                            as={MdOutlineCalendarToday}
                            color={textColorSecondary}
                            me='4px'
                        />
                        Past a year
                    </Text>
                </div>
                <Flex w='100%' flexDirection={{ base: "column", lg: "row" }}>
                    <Box h={"650px"} w={"100%"} mt='auto'>
                        {!loading ? lineChartDataTotalSpent.length > 0 ? (
                            <LineChart
                                chartData={lineChartDataTotalSpent}
                                chartOptions={lineChartOptionsTotalSpent}
                            />
                        ) : (
                            <Text>No Data Available</Text>
                        ) : (
                            <Stack mt="18px" gap="1">
                                <Skeleton height={"300px"} borderRadius={"12px"} />
                            </Stack>
                        )
                        }
                    </Box>
                </Flex>
            </Card>
        </Box>
    );
}
