/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck

'use client'

import React, { useState } from 'react'
import { LightBulbIcon } from "@heroicons/react/24/outline";
import Appliance from "../components/appliance";
import VerticalBarChart from "../components/vertical-bar-chart";
import PieChart from "../components/pie-chart";
import BarChart from "../components/bar-chart";

const insights = [
    { insight: "Consider turning off the bedroom fan" },
    { insight: "Schedule a time to regulate your A.C" },
    { insight: "Reduce usage of the microwave" }
]

export default function Dashboard() {

    return (
        <div>
            <h1 className='text-4xl text-primary'>
                Powersync
            </h1>
            <div className="flex flex-col 2lg:flex-row justify-between w-full mt-16 gap-12">
                <div className='2lg:basis-[45%] bg-white rounded-lg p-5'>
                    <h2 className='text-gray-500'>Active Power</h2>
                    <div className="flex justify-center flex-wrap md:flex-nowrap md:justify-between">
                        <div className="flex flex-col items-center">
                            <PieChart />
                            <span className='mt-[-25px] text-gray-400'>Most Usage</span>
                        </div>
                        <VerticalBarChart />
                    </div>
                </div>
                <div className='2lg:basis-[45%] bg-white rounded-lg p-5'>
                    <h2 className='text-gray-500'>Daily Usage</h2>
                    <BarChart />
                </div>
            </div>
            <div className='bg-white w-full mt-16 rounded-lg md:p-12 py-12 px-2 h-auto'>
                <div className="flex justify-between h-auto">
                    <div className='flex justify-evenly text-gray-400 flex-wrap gap-[30%] basis-[50%] items-center pr-[5%]'>
                        <Appliance text='A.C' initialShow={true} />
                        <Appliance text='Lights' />
                        <Appliance text='TV' initialShow={true} />
                        <Appliance text='AVR' />
                        <Appliance text='Fridge' initialShow={true} />
                        <Appliance text='Microwave' />
                    </div>
                    <div className='text-gray-500 gap-[30%] border-l-2 border-gray-300 items-center basis-[50%]'>
                        <h1 className='text-xl text-primary pb-8 pl-[10%]'>Insights</h1>
                        <hr className='h-[2px] bg-gray-300 w-[80%] ml-[7%]' />
                        <ul className='h-60 flex flex-col gap-5 mt-8 px-7 sm:px-[10%]'>
                            {
                                insights.map(item => (
                                    <li key={item.insight} className='text-gray-500 list-disc marker:text-primary marker:text-xl py-1'>{ item.insight }</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
