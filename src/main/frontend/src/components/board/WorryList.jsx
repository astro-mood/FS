import React from "react";
import styled from "styled-components";
import {useNavigate} from "react-router";

const WorryList = ({worries}) => {
    const navigate = useNavigate();

    const handleClick = (worryIdx) => {
        navigate(`/worry/${worryIdx}`);
    };

    return (
        <CommentSection>
            {worries.length > 0 ? (
                worries.map((worry) => (
                    <CommentContainer key={worry.worryIdx} onClick={() => handleClick(worry.worryIdx)}>
                        <StatusContainer>
                        <CreatedAt>{worry.createdAt}에 남긴 고민 👾</CreatedAt>
                        <StatusText>
                            {worry.isResolved ? "🚀 고민 해결 완료" : "🪐 고민 진행 중"}
                        </StatusText>
                        </StatusContainer>
                        <ContentWrapper>
                        <Title>{worry.title}</Title>
                        <Content>{worry.content}</Content>
                    </ContentWrapper>
                    </CommentContainer>
                ))
            ) : (
                <Nocomment>아직 남긴 고민이 없습니다.</Nocomment>
            )}
        </CommentSection>
    );
};

export default WorryList;

const CommentSection = styled.div`
    margin-top: 10px;
`;

const CommentContainer = styled.div`
    white-space: pre-wrap;
    background-color: #F9F9F9;
    cursor: pointer;

    &:hover {
        transform: scale(1.01); 
    }
`;

const CreatedAt = styled.div`
    font-size: 0.9rem;
    color: #303030;
    margin-top: 5px;
`;

const Title = styled.h3`
    font-size: 1rem;
    color: black;
    margin-bottom: 5px;
    
`;

const Content = styled.p`
    font-size: 1rem;
    color: #444;
    line-height: 1.2;
    margin-top: 5px;

    display: -webkit-box;
    -webkit-line-clamp: 1; 
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ContentWrapper = styled.div`
    font-size: 1rem;
    color: #444;
    line-height: 1.2;
    margin: -10px 10px 10px 10px;

`;

const StatusContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
`;

const StatusText = styled.div`
    font-size: 0.9rem;
    color: #777;
    margin-top: 5px;
`;

const Nocomment = styled.h2`
    font-size: 0.9rem;
    color: #555555;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
`;