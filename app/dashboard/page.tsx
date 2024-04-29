/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck

'use client'

import React, { useEffect, useState } from 'react'
import { LightBulbIcon } from "@heroicons/react/24/outline";
import Appliance from "../components/appliance";
import VerticalBarChart from "../components/vertical-bar-chart";
import PieChart from "../components/pie-chart";
import BarChart from "../components/bar-chart";
import { getCookieByNameEndsWith } from "@/app/utils/getCookies";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const mapSwitchToApiSwitch = { SW1: "17", SW2: "22", SW3: "23", SW4: "27" };

export default function Dashboard() {
    const [dailyConsumption, setDailyConsumption] = useState({});
    const [recommendedActions, setRecommendedActions] = useState([]);
    const [switchesToTurnOff, setSwitchesToTurnOff] = useState([]);
    const [totalPowerBySwitches, setTotalPowerBySwitches] = useState([]);
    const [availablePower, setAvailablePower] = useState([]);
    const getData = async (idToken) => {
        await new Promise((resolve, reject) => {
            axios.get('https://qn0kmnnt46.execute-api.eu-west-3.amazonaws.com/dev', {
                headers: {
                    'Authorization': `${idToken}`
                }
            })
                .then(response => JSON.parse(response.data.body))
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
        const idToken = getCookieByNameEndsWith('idToken');
        getData(idToken);
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
                        {
                            Object.keys(totalPowerBySwitches).map((item, index) => (
                                <Appliance key={item} text={item} switchNumber={mapSwitchToApiSwitch[item]} />
                            ))
                        }
                    </div>
                    <div className='text-gray-500 gap-[30%] border-l-2 border-gray-300 items-center basis-[50%]'>
                        <h1 className='text-xl text-primary pb-8 pl-[10%]'>Insights</h1>
                        <hr className='h-[2px] bg-gray-300 w-[80%] ml-[7%]' />
                        <div className="flex flex-wrap text-gray-400 gap-2 pl-[14%] mt-5">
                            {
                                switchesToTurnOff.map(item => (
                                    <Appliance key={item} text={item} switchNumber={mapSwitchToApiSwitch[item]} />
                                ))
                            }
                        </div>
                        <ul className='h-60 flex flex-col gap-5 px-7 sm:px-[10%]'>
                            {
                                recommendedActions.map(item => (
                                    <li key={item} className='text-gray-500 list-disc marker:text-primary marker:text-xl py-1'>{item.replace("SW2", "ACs & Heaters").replace("SW4", "Wall Sucket")}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
