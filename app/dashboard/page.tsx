// @ts-nocheck

'use client'

import React, { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Dashboard() {
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
        const percentagePower = Math.floor(verticalBarChartSeries[0].data[0] / verticalBarChartSeries[0].data.reduce((x, y) => x + y) * 100);
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
        <div className='h-screen'>
            <h1 className='text-4xl text-primary'>
                Dashboard
            </h1>
            <div className="flex justify-between w-full mt-16">
                <div className='basis-[45%] bg-white rounded-lg p-5'>
                    <h2 className='text-gray-500'>Active Power</h2>
                    <div className="flex justify-between">
                        <div className="flex flex-col items-center">
                            <Chart options={pieChartOptions} series={pieChartSeries} type="radialBar" width={250} height={280} />
                            <span className='mt-[-25px] text-gray-400'>Most Usage</span>
                        </div>
                        <Chart options={verTicalBarChartOptions} series={verticalBarChartSeries} type="bar" width={200} height={250} />
                    </div>
                </div>
                <div className='basis-[45%] bg-white rounded-lg p-5'>
                    <h2 className='text-gray-500'>Daily Usage</h2>
                    <Chart options={barChartOptions} series={barChartSeries} type="bar" width={500} height={250} />
                </div>
            </div>
            <div className='bg-white w-full mt-16 h-80 rounded-lg'></div>
        </div>
    )
}
