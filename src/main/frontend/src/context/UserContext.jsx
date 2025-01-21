import React, {createContext, useContext, useEffect, useState} from "react";
import DefaultProfile from "../images/profile.png"

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // 새로고침시에도 idx값 유지할 수 있도록
    const [userIdx, setUserIdx] = useState(() => {
        const storedUserIdx = localStorage.getItem("userIdx");
        return storedUserIdx ? Number(storedUserIdx) : null;
    });

    const [nickname, setNickname] = useState(() => {
        return localStorage.getItem("nickname") || null;
    });

    const [profileImage, setProfileImage] = useState(() => {
        const storedImage = localStorage.getItem("profileImage");
        // 이미지가 없으면 기본 프로필 이미지를 저장
        return storedImage && storedImage !== "null" ? storedImage : DefaultProfile;
    });

    const updateUserIdx = (newUserIdx) => {
        setUserIdx(newUserIdx);
        localStorage.setItem("userIdx", newUserIdx);
    };

    const updateNickname = (newNickname) => {
        setNickname(newNickname);
        localStorage.setItem("nickname", newNickname);
    };

    const updateProfileImage = (newProfileImage) => {
        const ChangeProfileImage = newProfileImage || DefaultProfile; // 이미지가 없으면 기본 이미지 사용
        setProfileImage(ChangeProfileImage);
        localStorage.setItem("profileImage", ChangeProfileImage);
    };

    useEffect(() => {
        const storedImage = localStorage.getItem("profileImage");
        if (!storedImage || storedImage === "null") {
            setProfileImage(DefaultProfile);
        }
    }, []);

    return (
        <UserContext.Provider value={{
            userIdx,
            setUserIdx: updateUserIdx,
            nickname,
            setNickname: updateNickname,
            profileImage,
            setProfileImage: updateProfileImage, }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};