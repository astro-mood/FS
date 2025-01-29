import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Chart } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    BubbleController,
} from "chart.js";
import { getAnalysis } from "../../api/api";

ChartJS.register(
    BubbleController,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const EmotionAnalysis = () => {
    const [chartData, setChartData] = useState({ datasets: [] });
    const [recommendation, setRecommendation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [period, setPeriod] = useState("daily");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handlePeriodClick("daily");
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getAnalysis(startDate, endDate, period);
            const { datasets = [], recommendation = "" } = response.data;
            setChartData(transformDataToChart(datasets));
            setRecommendation(recommendation);
        } catch (error) {
            console.error("분석 데이터를 불러오는 데 실패했습니다.", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate, period]);

    const handlePeriodClick = (p) => {
        setPeriod(p);

        const now = new Date(); // 오늘
        let newStart = "";
        let newEnd = "";

        const formatDate = (dateObj) => {
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, "0");
            const day = String(dateObj.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        switch (p) {
            // 오늘을 기준으로 이전 7일
            case "daily":
                const sevenDaysAgo = new Date(now);
                sevenDaysAgo.setDate(now.getDate() - 6); // 오늘 포함 7일이므로 6일전까지
                newStart = formatDate(sevenDaysAgo);
                newEnd = formatDate(now);
                setStartDate(newStart);
                setEndDate(newEnd);
                break;

            // 오늘을 포함하는 달
            case "weekly":
                const thisYear = now.getFullYear();
                const thisMonth = now.getMonth();
                const firstDay = new Date(thisYear, thisMonth, 1);
                const lastDay = new Date(thisYear, thisMonth+1, 0);

                newStart = formatDate(firstDay);
                newEnd = formatDate(lastDay);
                setStartDate(newStart);
                setEndDate(newEnd);
                break;

            // 오늘을 포함하는 연도
            case "monthly":
                const yyyy = now.getFullYear();
                newStart = `${yyyy}-01-01`;
                newEnd = `${yyyy}-12-31`;
                setStartDate(newStart);
                setEndDate(newEnd);
                break;

            // 2023년부터의 기록
            case "yearly":
                const currentYear = now.getFullYear();
                newStart = "2023-01-01";
                newEnd = `${currentYear}-12-31`;
                setStartDate(newStart);
                setEndDate(newEnd);
                break;
            default:
                break;
        }
    };

    // 차트용으로 데이터 변환
    const transformDataToChart = (datasets) => {
        const groupedData = {};
        const isDaily = (period === 'daily');
        const isYearly = (period === 'yearly');

        // 기간별로 시간 순서로 데이터 정렬하기 위해 사용
        const sortedDaily = [...new Set(datasets.map(item => item.x))].sort();
        const sortedWeekly = [...new Set(datasets.map(item => item.x))];
        const sortedYearly = [...new Set(datasets.map(item => item.x))]
            .map(date => ({ original: date, year: parseInt(date.replace("년", ""), 10) }))
            .sort((a, b) => a.year - b.year)
            .map(item => item.original);

        // 감정 라벨 1-7 다 포함하기 위해 사용
        const allEmotionIdx = [1, 2, 3, 4, 5, 6, 7];
        allEmotionIdx.forEach((idx) => {
            const label = emotionLabel(idx);
            const color = emotionColor(idx);

            groupedData[label] = {
                label: label,
                data: [],
                backgroundColor: color,
            };
        });

        // 버블 크기의 최소값과 최댓값을 통해 크기 조정
        const rValues = datasets.map((item) => item.r);
        const rMin = Math.min(...rValues);
        const rMax = Math.max(...rValues);

        datasets.forEach((item) => {
            const { x, y, r, emotionIdx } = item;
            const label = emotionLabel(emotionIdx);
            const color = emotionColor(emotionIdx);

            if (emotionIdx === 0) return;

            const minSize = 4;
            const maxSize = 13;

            let bubbleSize;
            if (isDaily) {
                bubbleSize = 7;
            } else {
                bubbleSize = (rMax === rMin) ? minSize : minSize + ((r - rMin) / (rMax - rMin)) * (maxSize - minSize);
            }

            if (!groupedData[label]) {
                groupedData[label] = {
                    label: label,
                    data: [],
                    backgroundColor: color,
                };
            }

            groupedData[label].data.push({
                x: x,
                y: y,
                r: bubbleSize,
            });
        });
        if (isDaily) {
            return { datasets: Object.values(groupedData), labels: sortedDaily };
        }
        if (isYearly) {
            return {datasets: Object.values(groupedData), labels: sortedYearly};
        }
            return { datasets: Object.values(groupedData), labels: sortedWeekly };
        };

    const options = {
        plugins: {
            legend: {
                labels: {
                    color: "white",
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const { x, y, r } = context.raw;
                        return `기간: ${x}, 점수: ${y}, 빈도: ${r}`;
                    },
                },
            },
        },
        scales: {
            x: {
                type: "category",
                ticks: {
                    color: "#fff",
                },
                grid: {
                    color: "rgba(255,255,255,0.2)",
                },
                title: {
                    display: true,
                    text: "기간",
                    color: "white",
                },
            },
            y: {
                ticks: {
                    color: "#fff",
                },
                grid: {
                    color: "rgba(255,255,255,0.2)",
                },
                title: {
                    display: true,
                    text: "감정 점수",
                    color: "white",
                },
                min: 0,
                max: 11,
            },
        },
    };

    return (
        <Container>
            <SubTitle>감정 분석</SubTitle>
            <ButtonContainer>
                <button onClick={() => handlePeriodClick("daily")}>일간</button>
                <button onClick={() => handlePeriodClick("weekly")}>주간</button>
                <button onClick={() => handlePeriodClick("monthly")}>월간</button>
                <button onClick={() => handlePeriodClick("yearly")}>연간</button>
            </ButtonContainer>
            {loading ? (
                <Message>Loading...</Message>
            ) : (
                <>
                    <Chart type="bubble"
                           data={chartData}
                           options={options} />
                    <Message>{recommendation}</Message>
                </>
            )}
        </Container>
    );
};

const emotionColor = (emotionIdx) => {
    const colors = {
        1: "rgb(255,193,8)",
        2: "rgba(54, 162, 235, 0.8)",
        3: "rgba(255, 99, 132, 0.8)",
        4: "rgba(153, 102, 255, 0.8)",
        5: "rgba(75, 192, 192, 0.8)",
        6: "rgba(255, 159, 64, 0.8)",
        7: "rgba(201, 203, 207, 0.8)",
    };
    return colors[emotionIdx] || "rgba(200, 200, 200, 0.6)";
};

const emotionLabel = (emotionIdx) => {
    const labels = {
        1: "기쁨",
        2: "설렘",
        3: "안도",
        4: "보통",
        5: "슬픔",
        6: "불안",
        7: "분노",
    };
    return labels[emotionIdx];
};

export default EmotionAnalysis;

const Container = styled.div`
    background: rgba(72, 49, 101, 0.7);
    color: white;
    padding: 20px;
    border-radius: 10px;
    width: 40%;
    flex: 1;
    max-width: 100%;
`;

const SubTitle = styled.h2`
    font-size: 1.2rem;
    margin: 0;
    margin-top: -5px;
    display: flex;
    justify-content: flex-start;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 20px;
    margin-top: -20px;

    button {
        background: #7D8DDE;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-family: 'NeoDunggeunmo';
        font-size: 0.7rem;
        
        &:hover {
            background-color: ${({color}) => (color === "#7D8DDE" ? "#4E2850" : "#4E2850")};
            transform: scale(1.05);
        }
    }
`;

const Message = styled.h2`
    font-size: 1.1rem;
    display: flex;
    justify-content: center;
    align-items: center;
`;