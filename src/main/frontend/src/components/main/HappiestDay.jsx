import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getLatestDiary } from "../../api/api";
import {useNavigate} from "react-router";

const HappiestDays = () => {
    const [diaries, setDiaries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLatestDiary = async () => {
            try {
                const response = await getLatestDiary();
                if (response.isSuccess && Array.isArray(response.data)) {
                    setDiaries(response.data);
                }
            } catch (error) {
                console.error("최근 일기 데이터를 불러오는 데 실패했습니다.", error);
            }
        };
        fetchLatestDiary();
    }, []);

    const handleDiaryClick = (diary_idx) => {
        navigate(`/diary/${diary_idx}`);
    };

    return (
        <Container>
            <Title>✨ 나의 최근 일기 ✨</Title>
            <CustomSwiper
                navigation={true}
                pagination={{ clickable: true }}
                modules={[Pagination, Navigation]}
            >
                {diaries.length > 0 ? (
                    diaries.map((diary, index) => (
                        <SwiperSlide key={index} onClick={() => handleDiaryClick(diary.diaryIdx)}>
                            <DiaryContent>
                                <CreatedAt>🛸 {diary.createdAt}의 기록</CreatedAt>
                                <h3>{diary.title}</h3>
                                <p>{diary.content}</p>
                            </DiaryContent>
                        </SwiperSlide>
                    ))
                ) : (
                    <SwiperSlide>
                        <DiaryContent>최근 일기가 없습니다.</DiaryContent>
                    </SwiperSlide>
                )}
            </CustomSwiper>
        </Container>
    );
};

export default HappiestDays;

const Container = styled.div`
    background: rgba(72, 49, 101, 0.7);
    padding: 20px;
    border-radius: 10px;
    flex: 1;
    max-width: 30%;
    text-overflow: ellipsis;
`;

const DiaryContent = styled.div`
    height: calc(100vh - 330px);
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 5px;
    margin-top: 10px;
    color: #555;
    flex: 1;
    background-color: #ffffff;
    overflow: hidden;
    line-height: 1.2;
    cursor: pointer;

    &:hover {
        transform: scale(1.01);
    }
`;

const CreatedAt = styled.div`
    padding: 10px;
    border-radius: 10px;
    color: #555;
    flex: 1;
    background-color: #ffffff;
    overflow: hidden;
    line-height: 1.0;
    margin-bottom: -10px;
    text-align: center;
    font-weight: bold;
`;

const Title = styled.h2`
    font-size: 1.2rem;
    margin: 0;
    margin-top: -10px;
    display: flex;
    justify-content: flex-start;
`;

const CustomSwiper = styled(Swiper)`
    .swiper-button-next, .swiper-button-prev {
        color: rgba(124, 141, 222, 0.3);
        transition: color 0.3s ease;

        &:hover {
            color: rgba(124, 141, 222, 1.0);
        }
    }

    .swiper-pagination {
        bottom: 20px; // 아래쪽으로 이동
        text-align: center;
        color: rgba(124, 141, 222, 0.3);;
    }

    .swiper-pagination-bullet {
        background-color: rgba(57, 74, 156, 0.5); 
        opacity: 0.7;
    }

    .swiper-pagination-bullet-active {
        background-color: rgba(72, 49, 101, 1.0); 
        opacity: 1;
    }
`;