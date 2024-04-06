/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck

'use client'

import React, { useEffect, useState } from 'react'
import { LightBulbIcon } from "@heroicons/react/24/outline";
import Appliance from "../components/appliance";
import VerticalBarChart from "../components/vertical-bar-chart";
import PieChart from "../components/pie-chart";
import BarChart from "../components/bar-chart";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
    const [dailyConsumption, setDailyConsumption] = useState({});
    const [recommendedActions, setRecommendedActions] = useState([]);
    const [switchesToTurnOff, setSwitchesToTurnOff] = useState([]);
    const [totalPowerBySwitches, setTotalPowerBySwitches] = useState([]);
    const [availablePower, setAvailablePower] = useState([]);
    const getData = async () => {
        await new Promise((resolve, reject) => {
            axios.get('https://haargkjp4icg6n32efofw4yuom0qgbvd.lambda-url.eu-west-3.on.aws/')
                .then(response => response.data)
                .then(data => {
                    setDailyConsumption(data.daily_consumption);
                    setRecommendedActions(data.insights.recommended_actions);
                    setSwitchesToTurnOff(data.insights.switches_to_turn_off);
                    setTotalPowerBySwitches(data.total_power_by_switches);
                    setAvailablePower(Math.floor((data.total_power_after_last_month / data.total_power_purchased) * 100));
                    resolve();
                })
                .catch(() => reject());
        })
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <h1 className='text-4xl text-primary'>
                Powersync
            </h1>
            <div className="flex flex-col 2lg:flex-row justify-between w-full mt-16 gap-12">
                <div className='2lg:basis-[45%] bg-white rounded-lg p-5 min-h-48'>
                    <h2 className='text-gray-500'>Active Power</h2>
                    <div className="flex justify-center flex-wrap md:flex-nowrap md:justify-between">
                        <div className="flex flex-col items-center">
                            <PieChart availablePower={availablePower} />
                            <span className='mt-[-25px] text-gray-400'>Most Usage</span>
                        </div>
                        <VerticalBarChart totalPowerBySwitches={totalPowerBySwitches} />
                    </div>
                </div>
                <div className='2lg:basis-[45%] bg-white rounded-lg p-5 min-h-48'>
                    <h2 className='text-gray-500'>Daily Usage</h2>
                    <BarChart dailyConsumption={dailyConsumption} />
                </div>
            </div>
            <div className='bg-white w-full mt-16 rounded-lg md:p-12 py-12 px-2 h-auto'>
                <div className="flex justify-between h-auto">
                    <div className='flex justify-evenly text-gray-400 flex-wrap gap-[15%] basis-[50%] items-center pr-[5%]'>
                        {/*
                            Object.keys(totalPowerBySwitches).map((item, index) => (
                                <Appliance key={item} text={item} initialShow={index % 2 ? false : true} />
                            ))
                            */}
                        <Appliance text={"SW1"} initialShow={false} switchNumber='17' />
                        <Appliance text={"SW2"} initialShow={false} switchNumber='22' />
                        <Appliance text={"SW3"} initialShow={false} switchNumber='23' />
                        <Appliance text={"SW4"} initialShow={false} switchNumber='27' />
                    </div>
                    <div className='text-gray-500 gap-[30%] border-l-2 border-gray-300 items-center basis-[50%]'>
                        <h1 className='text-xl text-primary pb-8 pl-[10%]'>Insights</h1>
                        <hr className='h-[2px] bg-gray-300 w-[80%] ml-[7%]' />
                        <div className="flex flex-wrap text-gray-400 gap-2 pl-[14%] mt-5">
                            {
                                switchesToTurnOff.map(item => (
                                    <Appliance key={item} text={item} initialShow={true} />
                                ))
                            }
                        </div>
                        <ul className='h-60 flex flex-col gap-5 px-7 sm:px-[10%]'>
                            {
                                recommendedActions.map(item => (
                                    <li key={item} className='text-gray-500 list-disc marker:text-primary marker:text-xl py-1'>{item}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={3500} position="top-right" />
        </div>
    )
}
