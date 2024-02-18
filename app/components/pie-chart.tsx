/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PieChart({ availablePower }) {
    const [pieChartAvailablePower, setPieChartAvailablePower] = useState([availablePower])

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

    const updatePieChart = () => {
        let colors = ['#5a7edc']
        if (pieChartAvailablePower <= 20) {
            colors = ['#EE5577'];
        }
        setPieChartOptions({
            ...pieChartOptions,
            colors,
        })
        setPieChartSeries([pieChartAvailablePower]);
    }

    useEffect(() => {
        setPieChartAvailablePower(availablePower);
    }, [availablePower]);

    useEffect(() => {
        updatePieChart();
    }, [pieChartAvailablePower])

    return (
        <Chart options={pieChartOptions} series={pieChartSeries} type="radialBar" width={250} height={280} />
    )
}
