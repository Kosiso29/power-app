// @ts-nocheck
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const colors = ['#2563EB', '#06B6D4', '#84CC16'];

function normalizeChartData(dailyConsumption) {
    if (Array.isArray(dailyConsumption?.series)) {
        return {
            categories: dailyConsumption.categories || [],
            series: dailyConsumption.series.map((series, index) => ({
                ...series,
                color: colors[index % colors.length],
            })),
        };
    }

    return {
        categories: Object.keys(dailyConsumption || {}),
        series: [{
            name: 'Raw sensor total',
            data: Object.values(dailyConsumption || {}),
            color: colors[0],
        }],
    };
}

export default function BarChart({ dailyConsumption = {} }) {
    const chartData = normalizeChartData(dailyConsumption);
    const [barChartOptions, setBarChartOptions] = useState({
        chart: {
            id: 'BarChart',
            toolbar: {
                show: false
            },
            foreColor: '#94A3B8',
            fontFamily: 'Arial, Helvetica, sans-serif'
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'left'
        },
        grid: { borderColor: 'rgba(148, 163, 184, 0.14)' },
        plotOptions: { bar: { borderRadius: 4, columnWidth: '54%' } },
        xaxis: {
            categories: chartData.categories
        },
        yaxis: {
            labels: {
                formatter: (value) => Math.round(value).toString()
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                type: 'vertical',
                shade: 'light'
            }
        }
    })
    const [barChartSeries, setBarChartSeries] = useState([{
        name: chartData.series[0]?.name || 'Sensor',
        data: chartData.series[0]?.data || [],
        color: chartData.series[0]?.color || colors[0]
    }]);
    
    useEffect(() => {
        const nextChartData = normalizeChartData(dailyConsumption);

        setBarChartOptions(prevState => {
            return {
                ...prevState,
                xaxis: {
                    categories: nextChartData.categories
                }
            }
        });
        setBarChartSeries(nextChartData.series)
    }, [dailyConsumption]);

    return (
        <Chart options={barChartOptions} series={barChartSeries} type="bar" width={"100%"} height={230} />
    )
}
