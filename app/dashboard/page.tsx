/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck

'use client'

import React, { useEffect, useState } from 'react'
import Appliance from "../components/appliance";
import VerticalBarChart from "../components/vertical-bar-chart";
import PieChart from "../components/pie-chart";
import BarChart from "../components/bar-chart";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const mapSwitchToRelay = Object.fromEntries(Array.from({ length: 8 }, (_, index) => [`SW${index + 1}`, String(index + 1)]));
const mapSwitchToRelayName = Object.fromEntries(Array.from({ length: 8 }, (_, index) => [`SW${index + 1}`, `relay${index + 1}`]));
const mapSensorToReadingField = { "Sensor 1": "sensor1_raw", "Sensor 2": "sensor2_raw", "Sensor 3": "sensor3_raw" };
const SWITCH_STATE_CACHE_KEY = "cyberwatt.switchStates";
const SWITCH_STATE_CACHE_TTL_MS = 5 * 60 * 1000;
const ACTIVE_DEVICE_KEY = "cyberwatt.activeDeviceId";

function getTelemetryData(responseData) {
    if (responseData?.body) {
        return typeof responseData.body === "string" ? JSON.parse(responseData.body) : responseData.body;
    }

    return responseData;
}

function normalizeDeviceList(responseData) {
    let data = responseData;

    if (data?.body) {
        data = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
    }

    const devices = Array.isArray(data) ? data : data?.devices || data?.items || [];

    return devices.map(device => {
        if (typeof device === "string" || typeof device === "number") {
            return { device_id: String(device) };
        }

        return device;
    }).filter(device => device?.device_id);
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

function getCurrentChannelIds(readings) {
    const channelIds = new Set();

    readings.forEach(reading => {
        (reading?.current_channels || []).forEach(channel => {
            if (channel?.available !== false && channel?.channel !== undefined) {
                channelIds.add(String(channel.channel));
            }
        });
    });

    return [...channelIds].sort((a, b) => Number(a) - Number(b));
}

function getCurrentChannelValue(reading, channelId) {
    const channel = (reading?.current_channels || []).find(item => String(item?.channel) === channelId);
    return channel?.available === false ? 0 : toNumber(channel?.mean_raw);
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
    const currentChannelIds = getCurrentChannelIds(readings);
    const usesCurrentChannels = currentChannelIds.length > 0;
    const dailyConsumption = usesCurrentChannels ? {
        categories: recentReadings.map((reading, index) => getChartLabel(reading.timestamp, index)),
        series: currentChannelIds.map(channelId => ({
            name: `Channel ${channelId}`,
            data: recentReadings.map(reading => getCurrentChannelValue(reading, channelId)),
        })),
    } : {
        categories: recentReadings.map((reading, index) => getChartLabel(reading.timestamp, index)),
        series: Object.entries(mapSensorToReadingField).map(([sensorName, readingField]) => ({
            name: sensorName,
            data: recentReadings.map(reading => toNumber(reading[readingField])),
        })),
    };
    const totalPowerBySwitches = usesCurrentChannels
        ? Object.fromEntries(currentChannelIds.map(channelId => [`Channel ${channelId}`, getCurrentChannelValue(latestReading, channelId)]))
        : Object.fromEntries(Object.entries(mapSensorToReadingField).map(([sensorName, readingField]) => [
            sensorName,
            toNumber(latestReading[readingField]),
        ]));
    const availableRelayStates = (latestReading?.relay_states || []).filter(relay => relay?.available !== false && relay?.relay !== undefined);
    const switchStates = availableRelayStates.length
        ? Object.fromEntries(availableRelayStates.map(relay => [`SW${relay.relay}`, toBoolean(relay.state)]))
        : Object.fromEntries(Object.entries(mapSwitchToRelayName).map(([switchName, relayName]) => [
            switchName,
            toBoolean(latestReading[relayName]),
        ]));
    const telemetryDeviceId = data.device_id || latestReading.device_id;
    const cachedStates = getCachedSwitchStates(telemetryDeviceId);
    const mergedSwitchStates = mergeCachedSwitchStates(switchStates, latestReadingTimestamp, cachedStates);

    return {
        dailyConsumption,
        recommendedActions: data?.insights?.recommended_actions || [],
        switchesToTurnOff: data?.insights?.switches_to_turn_off || [],
        totalPowerBySwitches,
        availablePower: toNumber(data?.available_power_percent ?? data?.available_power?.percentage),
        switchStates: mergedSwitchStates,
    };
}

function getCachedSwitchStates(deviceId = "default") {
    if (typeof window === "undefined") {
        return {};
    }

    try {
        return JSON.parse(localStorage.getItem(`${SWITCH_STATE_CACHE_KEY}.${deviceId}`) || "{}");
    } catch {
        return {};
    }
}

function cacheSwitchState(switchName, state, deviceId) {
    if (typeof window === "undefined") {
        return;
    }

    const cachedStates = getCachedSwitchStates(deviceId);
    localStorage.setItem(`${SWITCH_STATE_CACHE_KEY}.${deviceId || "default"}`, JSON.stringify({
        ...cachedStates,
        [switchName]: {
            state,
            updatedAt: Date.now(),
        },
    }));
}

function mergeCachedSwitchStates(telemetryStates, telemetryTimestamp, cachedStates = {}) {
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

function ChartPlaceholder({ type }) {
    if (type === "radial") {
        return <div className="dashboard-skeleton h-40 w-40 rounded-full border-[18px] border-slate-700/70 bg-transparent" />;
    }

    if (type === "horizontal") {
        return (
            <div className="flex h-[220px] w-[180px] flex-col justify-center gap-5">
                {[82, 64, 92].map(width => <div key={width} className="dashboard-skeleton h-5 rounded-sm" style={{ width: `${width}%` }} />)}
            </div>
        );
    }

    return (
        <div className="flex h-[230px] w-full items-end gap-3 px-2 pb-4">
            {[38, 68, 48, 84, 58, 76, 44, 64].map((height, index) => (
                <div key={`${height}-${index}`} className="dashboard-skeleton min-w-2 flex-1 rounded-t-sm" style={{ height: `${height}%` }} />
            ))}
        </div>
    );
}

export default function Dashboard() {
    const [dailyConsumption, setDailyConsumption] = useState({});
    const [recommendedActions, setRecommendedActions] = useState([]);
    const [switchesToTurnOff, setSwitchesToTurnOff] = useState([]);
    const [totalPowerBySwitches, setTotalPowerBySwitches] = useState({});
    const [availablePower, setAvailablePower] = useState([]);
    const [switchStates, setSwitchStates] = useState(null);
    const [devices, setDevices] = useState([]);
    const [activeDeviceId, setActiveDeviceId] = useState("");
    const [devicesLoading, setDevicesLoading] = useState(true);

    const getData = async (deviceId) => {
        await new Promise((resolve, reject) => {
            axios.get('/api/devices/telemetry', { params: { device_id: deviceId } })
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
        axios.get('/api/devices')
            .then(response => normalizeDeviceList(response.data))
            .then(deviceList => {
                setDevices(deviceList);
                const storedDeviceId = window.localStorage.getItem(ACTIVE_DEVICE_KEY);
                const selectedDevice = deviceList.find(device => device.device_id === storedDeviceId) || deviceList[0];

                if (selectedDevice) {
                    setActiveDeviceId(selectedDevice.device_id);
                    window.localStorage.setItem(ACTIVE_DEVICE_KEY, selectedDevice.device_id);
                } else {
                    setSwitchStates({ SW1: false, SW2: false });
                }
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    window.location.replace('/api/auth/logout');
                    return;
                }

                setSwitchStates({ SW1: false, SW2: false });
                toast.error(error?.response?.data?.message || error?.response?.data?.error || 'Unable to load your devices');
            })
            .finally(() => setDevicesLoading(false));
    }, []);

    useEffect(() => {
        if (!activeDeviceId) {
            return;
        }

        setSwitchStates(null);
        getData(activeDeviceId).catch((error) => {
            if (error?.response?.status === 401) {
                window.location.replace('/api/auth/logout');
                return;
            }

            setSwitchStates({ SW1: false, SW2: false });
            toast.error(error?.response?.data?.message || error?.response?.data?.error || 'Unable to load dashboard data');
        });
    }, [activeDeviceId]);

    const switchControls = switchStates ? Object.keys(switchStates) : Object.keys(mapSwitchToRelay);
    const dashboardLoading = switchStates === null;
    const updateSwitchState = (switchName, state) => {
        cacheSwitchState(switchName, state, activeDeviceId);
        setSwitchStates(prevState => ({ ...(prevState || {}), [switchName]: state }));
    };
    const selectDevice = (deviceId) => {
        setActiveDeviceId(deviceId);
        window.localStorage.setItem(ACTIVE_DEVICE_KEY, deviceId);
    };

    return (
        <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-black uppercase text-brand-cyan">Energy overview</p>
                    <h1 className='mt-1 text-3xl font-black text-brand-navy sm:text-4xl'>Cyberwatt dashboard</h1>
                    <p className="mt-2 text-sm text-slate-500">Live device readings and relay control.</p>
                </div>
                <div className="w-full sm:w-64">
                    <label htmlFor="activeDevice" className="mb-2 block text-xs font-black uppercase text-brand-cyan">Active device</label>
                    <select
                        id="activeDevice"
                        value={activeDeviceId}
                        onChange={(event) => selectDevice(event.target.value)}
                        disabled={devicesLoading || devices.length === 0}
                        className="min-h-11 w-full rounded-lg border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {devices.length === 0 && <option value="">{devicesLoading ? "Loading devices..." : "No claimed devices"}</option>}
                        {devices.map(device => (
                            <option key={device.device_id} value={device.device_id}>{device.name || device.device_name || device.device_id}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="mt-7 grid w-full gap-4 md:grid-cols-2 xl:grid-cols-[minmax(220px,0.7fr)_minmax(260px,0.9fr)_minmax(0,1.6fr)]">
                <section className='brand-panel flex flex-col p-4 sm:p-5'>
                    <h2 className='font-bold text-brand-navy'>Available Power</h2>
                    <p className="mt-1 text-xs text-slate-500">Current available capacity</p>
                    <div className="mt-3 flex min-h-[230px] justify-center">
                        {dashboardLoading ? <ChartPlaceholder type="radial" /> : <PieChart availablePower={availablePower} />}
                    </div>
                </section>
                <section className='brand-panel p-4 sm:p-5'>
                    <h2 className='font-bold text-brand-navy'>Latest Sensor Readings</h2>
                    <p className="mt-1 text-xs text-slate-500">Most recent raw ADC values</p>
                    <div className="flex min-h-[230px] items-center justify-start">
                        {dashboardLoading ? <ChartPlaceholder type="horizontal" /> : <VerticalBarChart totalPowerBySwitches={totalPowerBySwitches} />}
                    </div>
                </section>
                <section className='brand-panel p-4 sm:p-5 md:col-span-2 xl:col-span-1'>
                    <h2 className='font-bold text-brand-navy'>Recent Sensor Activity</h2>
                    <p className="mt-1 text-xs text-slate-500">Latest readings over time</p>
                    <div className="min-h-[230px]">
                        {dashboardLoading ? <ChartPlaceholder type="bars" /> : <BarChart dailyConsumption={dailyConsumption} />}
                    </div>
                </section>
            </div>
            <section className='brand-panel mt-4 h-auto w-full p-4 sm:p-5'>
                <div className="grid h-auto gap-5 lg:grid-cols-2">
                    <div>
                        <h2 className="font-bold text-brand-navy">Relay controls</h2>
                        <p className="mt-1 text-xs text-slate-500">Switch connected circuits on or off</p>
                        <div className='mt-5 flex flex-wrap items-center gap-7 text-slate-500'>
                        {
                            dashboardLoading ? [0, 1].map(item => (
                                <div key={item} className="flex w-[78px] flex-col items-center gap-2">
                                    <div className="dashboard-skeleton h-[78px] w-[78px] rounded-full" />
                                    <div className="dashboard-skeleton h-3 w-14 rounded-sm" />
                                    <div className="dashboard-skeleton h-2.5 w-7 rounded-sm" />
                                </div>
                            )) : switchControls.map(item => (
                                <Appliance
                                    key={item}
                                    text={item}
                                    switchNumber={mapSwitchToRelay[item]}
                                    deviceId={activeDeviceId}
                                    initialShow={switchStates[item] === true}
                                    onStateChange={(state) => updateSwitchState(item, state)}
                                />
                            ))
                        }
                        </div>
                    </div>
                    <div className='border-t border-slate-200 pt-5 text-slate-500 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0'>
                        <h2 className='font-bold text-brand-navy'>Insights</h2>
                        <p className="mt-1 text-xs text-slate-500">Recommended actions from your device data</p>
                        <div className="mt-5 flex flex-wrap gap-2 text-slate-400">
                            {
                                switchesToTurnOff.filter(item => mapSwitchToRelay[item]).map(item => (
                                    <Appliance
                                        key={item}
                                        text={item}
                                        switchNumber={mapSwitchToRelay[item]}
                                        deviceId={activeDeviceId}
                                        initialShow={switchStates?.[item] === true}
                                        onStateChange={(state) => updateSwitchState(item, state)}
                                    />
                                ))
                            }
                        </div>
                        <ul className='mt-4 flex min-h-24 flex-col gap-3 pl-5'>
                            {
                                recommendedActions.map(item => (
                                    <li key={item} className='text-gray-500 list-disc marker:text-primary marker:text-xl py-1'>{item.replace("SW2", "ACs & Heaters").replace("SW4", "Wall Sucket")}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}
