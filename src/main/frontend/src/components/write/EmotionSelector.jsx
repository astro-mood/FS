import React from 'react';
import styled from 'styled-components';

const emotionOptions = ["😄기쁨", "😚설렘", "😌안도", "🤖보통","😭슬픔","🥺불안","😡분노"];

const EmotionSelector = ({ emotionScores, handleEmotionChange, addEmotionScore, removeEmotionScore }) => {
    return (
        <EmotionContainer>
            <InputLabel>오늘의 감정</InputLabel>
            {emotionScores.map((pair, index) => (
                <EmotionRow key={index}>

                    <ButtonContainer>
                    <EmojiList>
                        {emotionOptions.map((emo, idx) => (
                            <EmojiOption
                                key={idx}
                                selected={pair.emotion === emo}
                                onClick={() => handleEmotionChange(index, 'emotion', emo)}
                            >
                                {emo}
                            </EmojiOption>
                        ))}
                    </EmojiList>
                        <AddButton onClick={addEmotionScore}>+</AddButton>
                        {/*1개 이상은 꼭 있어야 함*/}
                        <RemoveButton
                            onClick={() => {
                                if(emotionScores.length > 1) removeEmotionScore(index);
                            }}
                            disabled={emotionScores.length <= 1}
                        >
                            -
                        </RemoveButton>
                    </ButtonContainer>

                    {/*감정이 선택되면 슬라이드바 나오기*/}
                    {pair.emotion && (
                        <SliderContainer>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={pair.score}
                                onChange={e => handleEmotionChange(index, 'score', e.target.value)}
                                style={{ width: '1000px' }}

                            />
                            <span>{pair.score}</span>
                        </SliderContainer>
                    )}
                </EmotionRow>
            ))}
        </EmotionContainer>
    );
};

export default EmotionSelector;

const EmotionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
`;

const InputLabel = styled.label`
    font-size: 1.2rem;
    margin-bottom: 10px;
    display: block;
    font-family: "NeoDunggeunmo";
    color: black;
`;

const EmotionRow = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
`;

const EmojiList = styled.div`
    display: flex;
    gap: 8px;
    color: black;
`;

const EmojiOption = styled.span`
    font-size: 1.5rem;
    cursor: pointer;
    filter: ${props => props.selected ? 'none' : 'grayscale(80%)'};
    transition: filter 0.2s;
`;

const SliderContainer = styled.div`
    display: flex;
    align-items: center;
    width: 20vw;
    gap: 8px;
    color: #803569;
    input[type="range"] {
        width: 100%;
        accent-color: #803569;
    }
    
`;

const AddButton = styled.button`
    width: 20px;
    height: 20px;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    background-color: #7D8DDE;
    justify-content: center;
    color: white;
    border : none;
`;

const RemoveButton = styled.button`
    width: 20px;
    height: 20px;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    background-color: #7D8DDE;
    justify-content: center;
    color: white;
    border : none;
    font-weight: bold;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 4px;
    justify-content: center;
    align-items: center;


`;