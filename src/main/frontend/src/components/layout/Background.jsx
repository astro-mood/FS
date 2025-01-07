import React, { useEffect } from 'react';
import './Background.css';

const Background = () => {
    useEffect(() => {
        const createStars = (id, count) => {
            const container = document.getElementById(id);
            for (let i = 0; i < count; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%'; // 화면 가로 100% 안에서 랜덤 위치
                star.style.top = Math.random() * 200 + 'vh'; // 화면 세로 200vh 안에서 랜덤 위치
                star.style.width = Math.random() * 3 + 'px'; // 별 크기 랜덤 (1px ~ 3px)
                star.style.height = star.style.width; // 별은 정사각형
                container.appendChild(star);
            }
        };

        createStars('stars1', 150); // 첫 번째 레이어에 150개의 별 생성
        createStars('stars2', 100); // 두 번째 레이어에 100개의 별 생성
        createStars('stars3', 50);  // 세 번째 레이어에 50개의 별 생성
    }, []);

    return (
        <div className="background">
            <div id="stars1" className="layer"></div>
            <div id="stars2" className="layer"></div>
            <div id="stars3" className="layer"></div>
        </div>
    );
};

export default Background;
