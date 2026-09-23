/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PieChart({ availablePower }) {
    const [pieChartAvailablePower, setPieChartAvailablePower] = useState([availablePower])

    const [pieChartOptions, setPieChartOptions] = useState({
        labels: ["Available Power"],
        colors: ['#22D3EE'],
        chart: {
            id: 'PieChart',
            foreColor: '#CBD5E1',
            sparkline: {
                enabled: false
            }
        },
        stroke: {
            lineCap: 'round'
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                hollow: {
                    size: '62%',
                    background: 'rgba(7, 17, 31, 0.72)'
                },
                track: {
                    background: '#102342',
                    strokeWidth: '100%',
                    margin: 2
                },
                dataLabels: {
                    name: {
                        color: '#94A3B8',
                        fontSize: '12px',
                        fontWeight: 700,
                        offsetY: 22
                    },
                    value: {
                        color: '#F8FAFC',
                        fontSize: '28px',
                        fontWeight: 900,
                        offsetY: -14,
                        formatter: (value) => `${Math.round(value)}%`
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                type: 'horizontal',
                shade: 'dark',
                shadeIntensity: 0.15,
                gradientToColors: ['#2563EB'],
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            }
        }
    })

    const [pieChartSeries, setPieChartSeries] = useState([]);

    const updatePieChart = () => {
        let colors = ['#22D3EE']
        if (pieChartAvailablePower <= 20) {
            colors = ['#FB7185'];
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
        <div className="available-power-meter">
            <Chart options={pieChartOptions} series={pieChartSeries} type="radialBar" width={220} height={230} />
        </div>
    )
}
