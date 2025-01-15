import React, {createContext, useContext, useEffect, useState} from "react";

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
        return localStorage.getItem("profileImage") || null;
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
        setProfileImage(newProfileImage);
        localStorage.setItem("profileImage", newProfileImage);
    };


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