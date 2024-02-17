
import dynamic from 'next/dynamic'
import { useState } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function VerticalBarChart() {

    const [verTicalBarChartOptions] = useState({
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
            categories: ['Air Condition', 'Lights', 'TV', 'AVR', 'Fridge', 'Microwave', 'Others'],
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
    const [verticalBarChartSeries] = useState([{
        name: 'series-1',
        data: [125, 91, 70, 60, 49, 50, 35],
        color: '#5a7edc'
    }])

    return (
        <Chart options={verTicalBarChartOptions} series={verticalBarChartSeries} type="bar" width={200} height={250} />
    )
}
