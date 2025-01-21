import React from "react";
import styled from "styled-components";
import { Chart } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const EmotionAnalysis = () => {
    const data = {
        datasets: [
            {
                label: "기쁨",
                data: [
                    { x: "2025-01-20", y: 8, r: 15 },
                    { x: "2025-01-21", y: 7, r: 10 },
                ],
                backgroundColor: "rgba(255, 193, 7, 0.6)",
            },
            {
                label: "설렘",
                data: [
                    { x: "2025-01-20", y: 3, r: 20 },
                    { x: "2025-01-21", y: 4, r: 25 },
                ],
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
                label: "안도",
                data: [
                    { x: "2025-01-20", y: 2, r: 10 },
                    { x: "2025-01-21", y: 5, r: 15 },
                ],
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            {
                label: "보통",
                data: [
                    { x: "2025-01-20", y: 5, r: 18 },
                    { x: "2025-01-21", y: 6, r: 12 },
                ],
                backgroundColor: "rgba(13,64,64,0.6)",
            },
            {
                label: "슬픔",
                data: [
                    { x: "2025-01-20", y: 7, r: 25 },
                    { x: "2025-01-21", y: 8, r: 30 },
                    { x: "2025-01-22", y: 10, r: 50 },


                ],
                backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
            {
                label: "불안",
                data: [
                    { x: "2025-01-20", y: 1, r: 5 },
                    { x: "2025-01-21", y: 1, r: 8 },
                ],
                backgroundColor: "rgba(255, 159, 64, 0.6)",
            },
            {
                label: "분노",
                data: [
                    { x: "2025-01-20", y: 6, r: 20 },
                    { x: "2025-01-21", y: 5, r: 10 },
                ],
                backgroundColor: "rgba(201, 203, 207, 0.6)",
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: "category",
                title: {
                    display: true,
                    text: "날짜",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "감정점수",
                },
                min: 0,
                max: 10,
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const { x, y, r } = context.raw;
                        return `Date: ${x}, Score: ${y}, Frequency: ${r}`;
                    },
                },
            },
        },
    };



    return (
        <Container>
            <h3>감정 분석</h3>
            <Chart type="bubble" data={data} options={options} />
        </Container>
    );
};

export default EmotionAnalysis;

const Container = styled.div`
    background: rgba(72, 49, 101, 0.7);
    //background: rgba(255, 255, 255, 0.7);
    color: white;
    padding: 20px;
    border-radius: 10px;
    width: 40%;
    flex: 1;
    max-width: 100%;


`;
