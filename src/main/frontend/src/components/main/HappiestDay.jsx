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
            <h3>행복한 날의 기록</h3>
            <Swiper
                navigation={true}
                // pagination={{ clickable: true }}
                modules={[Navigation, Pagination]}
            >
                <SwiperSlide>
                    <ContentContaner>
                    <Content content="아프다! 길게 써야지만 안짤리나? 이거 하 중앙에 배치를 하면 되겠죠? 그리고 너무 길면 어떻게 나오는지 궁금해서 계속 쓰고 있어요 생각보다 엄청 길게 써야 하네요. 일단 계속 써볼게요. 차트의 색을 어떻게 할지 저 버튼색도 바꿔야 하나 고민되네용. 아무튼 이거 왜케 레이아웃 맞추기가 힘든가요 길게 쓰는 게 더 힘드네요 그냥 긴 기록을 보여주는 게 나을 거 같기도 하네용 이제 두 줄만 더 써보면 될 거 같아요!!!" />
                </ContentContaner>
                </SwiperSlide>
                <SwiperSlide>행복한 날 2</SwiperSlide>
                <SwiperSlide>행복한 날 3</SwiperSlide>
            </Swiper>
        </Container>
    );
};

export default HappiestDays;

const Container = styled.div`
    background: rgba(72, 49, 101, 0.7);
    padding: 20px;
    border-radius: 20px;
    flex: 1;
    max-width: 30%;
    text-overflow: ellipsis;
`;

const ContentContaner = styled.div`
    border-radius: 0px;
    height: 52vh;
`;
