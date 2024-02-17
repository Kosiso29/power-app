
import dynamic from 'next/dynamic'
import { useState } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function BarChart() {
    const [barChartOptions] = useState({
        chart: {
            id: 'BarChart',
            toolbar: {
                show: false
            },
            foreColor: '#AAAAAA'
        },
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        fill: {
            type: 'gradient',
            gradient: {
                type: 'vertical',
                shade: 'light'
            }
        }
    })
    const [barChartSeries] = useState([{
        name: 'series-1',
        data: [30, 40, 35, 50, 49, 60, 70],
        color: '#5a7edc'
    }])

    return (
        <Chart options={barChartOptions} series={barChartSeries} type="bar" width={"100%"} height={"auto"} />
    )
}
