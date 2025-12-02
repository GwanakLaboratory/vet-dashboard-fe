import { useMemo } from "react";
import {
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    BarChart,
    Bar,
} from "recharts";

interface SimpleChartProps {
    data: any[];
    config: {
        type: 'scatter' | 'line' | 'bar';
        xAxisKey: string;
        yAxisKey: string;
        title?: string;
    };
}

export function SimpleChart({ data, config }: SimpleChartProps) {
    const { type, xAxisKey, yAxisKey, title } = config;

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                데이터가 없습니다.
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[300px] flex flex-col">
            {title && <h4 className="text-sm font-medium text-center mb-4">{title}</h4>}
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    {type === 'scatter' ? (
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid />
                            <XAxis
                                type="number"
                                dataKey={xAxisKey}
                                name={xAxisKey}
                                label={{ value: xAxisKey, position: 'bottom', offset: 0 }}
                            />
                            <YAxis
                                type="number"
                                dataKey={yAxisKey}
                                name={yAxisKey}
                                label={{ value: yAxisKey, angle: -90, position: 'left' }}
                            />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend />
                            <Scatter name="Patients" data={data} fill="#8884d8" />
                        </ScatterChart>
                    ) : type === 'line' ? (
                        <LineChart data={data.sort((a, b) => Number(a[xAxisKey]) - Number(b[xAxisKey]))} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xAxisKey} label={{ value: xAxisKey, position: 'bottom', offset: 0 }} />
                            <YAxis label={{ value: yAxisKey, angle: -90, position: 'left' }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey={yAxisKey} stroke="#8884d8" dot={false} />
                        </LineChart>
                    ) : (
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xAxisKey} label={{ value: xAxisKey, position: 'bottom', offset: 0 }} />
                            <YAxis label={{ value: yAxisKey, angle: -90, position: 'left' }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={yAxisKey} fill="#8884d8" />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
