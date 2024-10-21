// Chakra imports
import {
    Box,
    Button,
    Flex,
    FormControl,
    Icon,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { Select } from 'chakra-react-select';
// Custom components
import Card from "../../../components/card/Card";
import LineChart from "../../../components/charts/LineChart";
import React, { useEffect, useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";

import axios from "../../../variables/axiosConfig";

export default function RankChart(props) {
    const { ...rest } = props;

    const [loading, setLoading] = useState(true);
    const textColorSecondary = useColorModeValue("secondaryGray.600", "white");

    const [categories, setCategories] = useState([])

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
        legend: {
            show: false,
        },
        stroke: {
            width: 3,
            curve: 'smooth'
        }
    });

    const getCategories = async () => {
        const res = await axios.get('/api/get-categories')
        if (res.data.success) {
            setCategories(res.data.categories);
        }
        else {
            Store.addNotification({
                title: "Failed to get categories",
                message: res.data.error,
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            })
        }
    }

    const getTrendsDataAndXaxisValue = async () => {
        setLoading(true);
        const res = await axios.get('/api/get-trends-data-for-chart');
        if (res.data.success) {
            setLineChartOptionsTotalSpent(prevState => ({
                ...prevState,
                // xaxis: {
                //     ...prevState.xaxis,
                //     // type: 'datetime',
                //     categories: res.data.xaxis || ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB"]
                // },
                labels: res.data.xaxis || ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB"]
            }))
            setLineChartDataTotalSpent(res.data.chartData || [{ name: "Sample", data: [0, 10, 20, 30, 40, 50], }]);
            setLoading(false);
        }
    }

    useEffect(() => {
        getCategories();
        getTrendsDataAndXaxisValue();
    }, [])

    const [showingCategory, setShowingCategory] = useState('');

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Card
                justifyContent='center'
                align='center'
                direction='column'
                w='100%'
                mb='0px'
                {...rest}>
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
                    <FormControl w='200px'>
                        <Select
                            id="sort-select"
                            defaultValue={[{ label: 'all', value: 'all' }]}
                            name="sorts"
                            options={[{ id: '', label: 'all', value: 'all' }].concat(categories.map(category => ({ id: category.id, label: category.title, value: category.title })))}
                            closeMenuOnSelect={false}
                            ms='auto'
                            w='200px'
                            h='37px'
                            lineHeight='100%'
                            borderRadius='10px'
                            size="sm"
                            onChange={(e) => setShowingCategory(e.id)}
                        />
                    </FormControl>
                </div>
                <Flex w='100%' flexDirection={{ base: "column", lg: "row" }}>
                    <Box h={"650px"} w={"100%"} mt='auto'>
                        {!loading && lineChartDataTotalSpent.length > 0 ? (
                            <LineChart
                                chartData={lineChartDataTotalSpent}
                                chartOptions={lineChartOptionsTotalSpent}
                            />
                        ) : (
                            <Text>No Data Available</Text>
                        )}
                    </Box>
                </Flex>
            </Card>
        </Box>
    );
}
