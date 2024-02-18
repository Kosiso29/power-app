// @ts-nocheck

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function VerticalBarChart({ totalPowerBySwitches }) {
    const [sortedPower, setSortedPower] = useState([]);
    const [sortedSwitches, setSortedSwitches] = useState([]);

    const [verticalBarChartOptions, setVerticalBarChartOptions] = useState({
        chart: {
            id: 'VerticalBarChart',
            toolbar: {
                show: false
            },
            foreColor: '#AAAAAA',
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
        },
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        xaxis: {
            categories: sortedSwitches,
            labels: {
                show: false
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                type: 'diagonal2',
                shade: 'light'
            }
        }
    })
    const [verticalBarChartSeries, setVerticalBarChartSeries] = useState([{
        name: 'series-1',
        data: sortedPower,
        color: '#5a7edc'
    }])

    useEffect(() => {
        const sortedTotalPowerBySwitches = Object.entries(totalPowerBySwitches).sort(([, a], [, b]) => b - a);
        setSortedSwitches(sortedTotalPowerBySwitches.map(switchPowerArray => switchPowerArray[0]));
        setSortedPower(sortedTotalPowerBySwitches.map(switchPowerArray => switchPowerArray[1]));
    }, [totalPowerBySwitches]);

    useEffect(() => {
        setVerticalBarChartOptions(prevState => {
            return {
                ...prevState,
                xaxis: {
                    categories: sortedSwitches,
                    labels: {
                        show: false
                    }
                },
            }
        });
        setVerticalBarChartSeries(prevState => {
            return [{
                ...prevState[0],
                data: sortedPower,
            }]
        });
    }, [sortedPower, sortedSwitches])

    return (
        <Chart options={verticalBarChartOptions} series={verticalBarChartSeries} type="bar" width={200} height={250} />
    )
}
