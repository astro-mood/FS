import React from "react";
import styled from "styled-components";
import LogoImage from '../../images/logo.png';


const AstroMoodGuide = () => {
    return (
        <Wrapper>
            <Card>
                <Title>이용방법</Title>
                <SectionContainer>
                    <BackgroundLogo />
                    <Paragraph>
                        ASTRO MOOD는 우주를 뜻하는 ASTRO와 기분을 뜻하는 MOOD의 합성어입니다.{"\n"}
                        기분에 따라 감정을 분석하고 수치화하여, 스스로 자신의 감정을 이해하고 다룰 수 있도록 돕는 서비스입니다.
                    </Paragraph>
                    <SectionTitle>일기 작성 방법</SectionTitle>
                    <List>
                        <li>하루에 한 편의 일기만 작성할 수 있습니다.</li>
                        <li>일기는 오늘 날짜에만 작성 가능하며, 지나간 날짜나 미래의 날짜는 작성할 수 없습니다.</li>
                        <li>오늘의 감정에 어울리는 이모지를 선택한 뒤, 감정의 점수를 입력해주세요.</li>
                        <li>작성된 일기는 언제든지 열람할 수 있으며, 자신만 볼 수 있습니다.</li>
                    </List>
                    <SectionTitle>고민상담소 이용방법</SectionTitle>
                    <List>
                        <li>마음 속에 담아두었던 고민을 자유롭게 작성해주세요.</li>
                        <li>고민상담소에 공감이 가는 글을 발견했다면, 위로의 말을 건네주세요. 작은 말 한마디가 누군가에게 큰 힘이 될 수 있습니다.</li>
                        <li>모든 게시글과 댓글은 익명으로 작성됩니다.</li>
                    </List>
                    <SectionTitle>&lt;ASTRO MOOD 규칙&gt;</SectionTitle>
                    <List>
                        <li>일기는 작성자만 열람 가능합니다.</li>
                        <li>고민상담소의 게시글과 위로의 말 모두 익명으로 게시되며, 개인정보를 포함하지 않도록 주의해주세요.</li>
                        <li>욕설, 비방, 혹은 부적절한 내용을 작성할 경우, 해당 계정은 사전 경고 없이 회원 탈퇴 처리될 수 있습니다.</li>
                        <li>모두가 안심하고 감정을 나눌 수 있는 안온한 공간을 만들어주세요!</li>
                    </List>
                </SectionContainer>
            </Card>
        </Wrapper>
    );
};

export default AstroMoodGuide;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: #fff;
  padding: 20px 0;
`;

const SectionContainer = styled.div`
    position: relative;
    min-height: auto;
    color: #fff;
    background: rgba(106, 95, 122, 0.7);
    padding: 20px;
    border-radius: 0.5rem;
`;

const BackgroundLogo = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${LogoImage});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.1; 
    z-index: 0;
`;


const Card = styled.div`
    background: rgba(72, 49, 101, 0.7);
    color: #ffffff;
    -webkit-text-stroke-color: black;
    -webkit-text-stroke-width: 0.2px;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    width: 90%;
    text-align: left;
    margin-top: 50px;
    margin-bottom: 50px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 500;
  margin-top: -5px;
  color: white;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 2rem; 
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const List = styled.ul`
  list-style: disc;
  margin-left: 1.5rem;
  margin-bottom: 0;
  line-height: 1.6;
  font-size: 1.3rem;
`;

const Paragraph = styled.p`
  white-space: pre-line;
  font-size: 1.25rem;
  line-height: 1.6;
  color: #fff;
  position: relative;
  z-index: 1;
  margin-bottom: 70px;
`;