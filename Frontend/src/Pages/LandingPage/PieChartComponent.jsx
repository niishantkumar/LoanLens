import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function PieChartComponent({ amount, interest }) {

    const data = [
        { name: "Principal", value: Number(amount) },
        { name: "Interest", value: Number(interest) },
    ];

    const COLORS = ["#0d6efd", "red"];


    const renderCustomLabel = ({ percent }) => {
        return `${(percent * 100).toFixed(0)}%`;
    };

    return (
        <PieChart width={320} height={320}>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={110}
                dataKey="value"
                label={renderCustomLabel}
                isAnimationActive={true}
                animationDuration={800}
            >
                {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                ))}
            </Pie>

            <Tooltip formatter={(value) => `₹ ${value}`} />
            <Legend />
        </PieChart>
    );
}

export default PieChartComponent;