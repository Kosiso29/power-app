// @ts-nocheck
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function BarChart({ daily_consumption = {} }) {
    const [barChartOptions, setBarChartOptions] = useState({
        chart: {
            id: 'BarChart',
            toolbar: {
                show: false
            },
            foreColor: '#AAAAAA'
        },
        xaxis: {
            categories: Object.keys(daily_consumption)
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
        name: 'series-1',
        data: Object.values(daily_consumption),
        color: '#5a7edc'
    }]);
    
    useEffect(() => {
        setBarChartOptions(prevState => {
            return {
                ...prevState,
                xaxis: {
                    categories: Object.keys(daily_consumption)
                }
            }
        });
        setBarChartSeries(prevState => {
            return [{
                ...prevState[0],
                data: Object.values(daily_consumption),
            }]
        })
    }, [daily_consumption]);

    return (
        <Chart options={barChartOptions} series={barChartSeries} type="bar" width={"100%"} height={"auto"} />
    )
}
