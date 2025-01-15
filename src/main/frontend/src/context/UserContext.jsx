import React, {createContext, useContext, useEffect, useState} from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // 새로고침시에도 idx값 유지할 수 있도록
    const [userIdx, setUserIdx] = useState(() => {
        const storedUserIdx = localStorage.getItem("userIdx");
        return storedUserIdx ? Number(storedUserIdx) : null;
    });

    const updateUserIdx = (newUserIdx) => {
        setUserIdx(newUserIdx);
        localStorage.setItem("userIdx", newUserIdx);
    };


    return (
        <UserContext.Provider value={{ userIdx, setUserIdx: updateUserIdx }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};