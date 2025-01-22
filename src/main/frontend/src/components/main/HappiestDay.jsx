import React from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Content from "../board/PostContent";

const HappiestDays = () => {
    return (
        <Container>
            <Title>✨ 행복한 날의 기록 ✨</Title>
            <CustomSwiper
                navigation={true}
                // pagination={{ clickable: true }}
                modules={[Navigation, Pagination]}
            >
                <SwiperSlide>
                    <DiaryContent>"가나다라마바사아자차카타파하 아프다! 길게 써야지만 안짤리나? 이거 하 중앙에 배치를 하면 되겠죠? 그리고 너무 길면 어떻게 나오는지 궁금해서 가나다라마바사아자차카타파하 아프다! 길게 써야지만 안짤리나? 이거 하 중앙에 배치를 하면 되겠죠? 그리고 너무 길면 어떻게 나오는지 궁금해서 가나다라마바사아자차카타파하 아프다! 길게 써야지만 안짤리나? 이거 하 중앙에 배치를 하면 되겠죠? 그리고 너무 길면 어떻게 나오는지 궁금해서 가나다라마바사아자차카타파하 아프다! 길게 써야지만 안짤리나? 이거 하 중앙에 배치를 하면 되겠죠? 그리고 너무 길면 어떻게 나오는지 궁금해서 가나다라마바사아자차카타파하 아프다! 길게 써야지만 안짤리나? 이거 하 중앙에 배치를 하면 되겠죠? 그리고 너무 길면 어떻게 나오는지 궁금해서 가나다라마바사아자차카타파하 아프다! 길게 써야지만 안짤리나? 이거 하 중앙에 배치를 하면 되겠죠? 그리고 너무 길면 어떻게 나오는지 궁금해서 가나다라마바사아자차카타파하 아프다! 길게 써야지만 안짤리나? 이거 하 중앙에 배치를 하면 되겠죠? 그리고 너무 길면 어떻게 나오는지 궁금해서 계속 쓰고 있어요 생각보다 엄청 길게 써야 하네요. 일단 계속 써볼게요. 차트의 색을 어떻게 할지 저 버튼색도 바꿔야 하나 고민되네용. 아무튼 이거 왜케 레이아웃 맞추기가 힘든가요 길게 쓰는 게 더 힘드네요 그냥 긴 기록을 보여주는 게 나을 거 같기도 하네용 이제 두 줄만 더 써보면 될 거 같아요!!!"
                    </DiaryContent>
                </SwiperSlide>
                <SwiperSlide>행복한 날 2</SwiperSlide>
                <SwiperSlide>행복한 날 3</SwiperSlide>
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
    height: calc(100vh - 348px);
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 20px;
    margin-top: 20px;
    color: #555;
    flex: 1;
    background-color: #ffffff;
    overflow: hidden;
    line-height: 1.4;
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
`;