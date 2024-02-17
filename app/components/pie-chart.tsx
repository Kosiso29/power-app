/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PieChart() {

    const [pieChartOptions, setPieChartOptions] = useState({
        chart: {
            id: 'PieChart'
        },
        labels: ["Available Power"],
        colors: ['#5a7edc'],
        fill: {
            type: 'gradient',
            gradient: {
                type: 'diagonal1',
                shade: 'light'
            }
        }
    })

    const [pieChartSeries, setPieChartSeries] = useState([]);

    const calculateAvailablePower = () => {
        // const percentagePower = Math.floor(verticalBarChartSeries[0].data[0] / verticalBarChartSeries[0].data.reduce((x, y) => x + y) * 100);
        const percentagePower = Math.floor(Math.random() * 100) + 1;;
        let colors = ['#5a7edc']
        if (percentagePower <= 20) {
            colors = ['#EE5577'];
        }
        setPieChartOptions({
            ...pieChartOptions,
            colors,
        })
        setPieChartSeries([percentagePower]);
    }

    useEffect(() => {
        calculateAvailablePower();
    }, [])

    return (
        <Chart options={pieChartOptions} series={pieChartSeries} type="radialBar" width={250} height={280} />
    )
}
