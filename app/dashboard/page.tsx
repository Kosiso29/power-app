/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck

'use client'

import React, { useEffect, useRef, useState } from 'react'
import Appliance from "../components/appliance";
import VerticalBarChart from "../components/vertical-bar-chart";
import PieChart from "../components/pie-chart";
import BarChart from "../components/bar-chart";
import Loading from "../components/loading";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const mapSwitchToRelay = { SW1: "1", SW2: "2" };
const mapSwitchToRelayName = { SW1: "relay1", SW2: "relay2" };
const mapSensorToReadingField = { "Sensor 1": "sensor1_raw", "Sensor 2": "sensor2_raw", "Sensor 3": "sensor3_raw" };
const SWITCH_STATE_CACHE_KEY = "cyberwatt.switchStates";
const SWITCH_STATE_CACHE_TTL_MS = 5 * 60 * 1000;

function getTelemetryData(responseData) {
    if (responseData?.body) {
        return typeof responseData.body === "string" ? JSON.parse(responseData.body) : responseData.body;
    }

    return responseData;
}

function toNumber(value) {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : 0;
}

function getReadingTimestamp(reading) {
    return toNumber(reading?.timestamp);
}

function toBoolean(value) {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "string") {
        return value.toLowerCase() === "true" || value === "1";
    }

    return value === 1;
}

function getChartLabel(timestamp, index) {
    const numericTimestamp = Number(timestamp);

    if (!Number.isFinite(numericTimestamp)) {
        return `Reading ${index + 1}`;
    }

    return new Date(numericTimestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

function normalizeTelemetryData(data) {
    if (!Array.isArray(data?.readings)) {
        const insights = data?.insights || {};
        const totalPowerPurchased = Number(data?.total_power_purchased || 0);
        const totalPowerAfterLastMonth = Number(data?.total_power_after_last_month || 0);
        const fallbackSwitchStates = { SW1: false, SW2: false };

        return {
            dailyConsumption: data?.daily_consumption || {},
            recommendedActions: insights.recommended_actions || [],
            switchesToTurnOff: insights.switches_to_turn_off || [],
            totalPowerBySwitches: data?.total_power_by_switches || {},
            availablePower: totalPowerPurchased ? Math.floor((totalPowerAfterLastMonth / totalPowerPurchased) * 100) : 0,
            switchStates: fallbackSwitchStates,
        };
    }

    const readings = [...data.readings].sort((a, b) => getReadingTimestamp(a) - getReadingTimestamp(b));
    const latestReading = readings[readings.length - 1] || {};
    const latestReadingTimestamp = getReadingTimestamp(latestReading);
    const recentReadings = readings.slice(-12);
    const dailyConsumption = {
        categories: recentReadings.map((reading, index) => getChartLabel(reading.timestamp, index)),
        series: Object.entries(mapSensorToReadingField).map(([sensorName, readingField]) => ({
            name: sensorName,
            data: recentReadings.map(reading => toNumber(reading[readingField])),
        })),
    };
    const totalPowerBySwitches = Object.fromEntries(Object.entries(mapSensorToReadingField).map(([sensorName, readingField]) => [
        sensorName,
        toNumber(latestReading[readingField]),
    ]));
    const switchStates = Object.fromEntries(Object.entries(mapSwitchToRelayName).map(([switchName, relayName]) => [
        switchName,
        toBoolean(latestReading[relayName]),
    ]));
    const cachedStates = getCachedSwitchStates();
    const mergedSwitchStates = mergeCachedSwitchStates(switchStates, latestReadingTimestamp, cachedStates);

    return {
        dailyConsumption,
        recommendedActions: [],
        switchesToTurnOff: [],
        totalPowerBySwitches,
        availablePower: 0,
        switchStates: mergedSwitchStates,
    };
}

function getCachedSwitchStates() {
    if (typeof window === "undefined") {
        return {};
    }

    try {
        return JSON.parse(localStorage.getItem(SWITCH_STATE_CACHE_KEY) || "{}");
    } catch {
        return {};
    }
}

function cacheSwitchState(switchName, state) {
    if (typeof window === "undefined") {
        return;
    }

    const cachedStates = getCachedSwitchStates();
    localStorage.setItem(SWITCH_STATE_CACHE_KEY, JSON.stringify({
        ...cachedStates,
        [switchName]: {
            state,
            updatedAt: Date.now(),
        },
    }));
}

function mergeCachedSwitchStates(telemetryStates, telemetryTimestamp, cachedStates = getCachedSwitchStates()) {
    const now = Date.now();

    return Object.fromEntries(Object.entries(telemetryStates).map(([switchName, telemetryState]) => {
        const cachedState = cachedStates[switchName];
        const cacheIsFresh = cachedState
            && typeof cachedState.state === "boolean"
            && now - cachedState.updatedAt < SWITCH_STATE_CACHE_TTL_MS
            && cachedState.updatedAt > telemetryTimestamp;

        return [switchName, cacheIsFresh ? cachedState.state : telemetryState];
    }));
}

export default function Dashboard() {
    const [dailyConsumption, setDailyConsumption] = useState({});
    const [recommendedActions, setRecommendedActions] = useState([]);
    const [switchesToTurnOff, setSwitchesToTurnOff] = useState([]);
    const [totalPowerBySwitches, setTotalPowerBySwitches] = useState({});
    const [availablePower, setAvailablePower] = useState([]);
    const [switchStates, setSwitchStates] = useState(null);
    const telemetryLoaded = useRef(false);

    const getData = async () => {
        await new Promise((resolve, reject) => {
            axios.get('/api/devices/telemetry')
                .then(response => getTelemetryData(response.data))
                .then(data => {
                    const telemetry = normalizeTelemetryData(data);

                    setDailyConsumption(telemetry.dailyConsumption);
                    setRecommendedActions(telemetry.recommendedActions);
                    setSwitchesToTurnOff(telemetry.switchesToTurnOff);
                    setTotalPowerBySwitches(telemetry.totalPowerBySwitches);
                    setAvailablePower(telemetry.availablePower);
                    setSwitchStates(telemetry.switchStates);
                    resolve();
                })
                .catch((error) => reject(error));
        })
    }

    useEffect(() => {
        if (!telemetryLoaded.current) {
            telemetryLoaded.current = true;
            getData().catch((error) => {
                if (error?.response?.status === 401) {
                    window.location.replace('/api/auth/logout');
                    return;
                }

                telemetryLoaded.current = false;
                setSwitchStates({ SW1: false, SW2: false });
                toast.error('Unable to load dashboard data');
            });
        }
    }, []);

    const relaySwitches = Object.keys(totalPowerBySwitches).filter(item => mapSwitchToRelay[item]);
    const switchControls = relaySwitches.length ? relaySwitches : Object.keys(mapSwitchToRelay);
    const updateSwitchState = (switchName, state) => {
        cacheSwitchState(switchName, state);
        setSwitchStates(prevState => ({ ...(prevState || {}), [switchName]: state }));
    };

    return (
        <div>
            <h1 className='text-4xl text-primary'>
                Cyberwatt
            </h1>
            <div className="flex flex-col 2lg:flex-row justify-between w-full mt-16 gap-12">
                <div className='2lg:basis-[45%] bg-white rounded-lg p-5 min-h-48'>
                    <h2 className='text-gray-500'>Latest Sensor Readings</h2>
                    <div className="flex justify-center flex-wrap md:flex-nowrap md:justify-between">
                        <div className="flex flex-col items-center">
                            <PieChart availablePower={availablePower} />
                        </div>
                        <VerticalBarChart totalPowerBySwitches={totalPowerBySwitches} />
                    </div>
                </div>
                <div className='2lg:basis-[45%] bg-white rounded-lg p-5 min-h-48'>
                    <h2 className='text-gray-500'>Recent Sensor Activity</h2>
                    <BarChart dailyConsumption={dailyConsumption} />
                </div>
            </div>
            <div className='bg-white w-full mt-16 rounded-lg md:p-12 py-12 px-2 h-auto'>
                <div className="flex justify-between h-auto">
                    <div className='flex justify-evenly text-gray-400 flex-wrap gap-[15%] basis-[50%] items-center pr-[5%]'>
                        {
                            switchStates === null ? <Loading /> : switchControls.map(item => (
                                <Appliance
                                    key={item}
                                    text={item}
                                    switchNumber={mapSwitchToRelay[item]}
                                    initialShow={switchStates[item] === true}
                                    onStateChange={(state) => updateSwitchState(item, state)}
                                />
                            ))
                        }
                    </div>
                    <div className='text-gray-500 gap-[30%] border-l-2 border-gray-300 items-center basis-[50%]'>
                        <h1 className='text-xl text-primary pb-8 pl-[10%]'>Insights</h1>
                        <hr className='h-[2px] bg-gray-300 w-[80%] ml-[7%]' />
                        <div className="flex flex-wrap text-gray-400 gap-2 pl-[14%] mt-5">
                            {
                                switchesToTurnOff.filter(item => mapSwitchToRelay[item]).map(item => (
                                    <Appliance
                                        key={item}
                                        text={item}
                                        switchNumber={mapSwitchToRelay[item]}
                                        initialShow={switchStates?.[item] === true}
                                        onStateChange={(state) => updateSwitchState(item, state)}
                                    />
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
