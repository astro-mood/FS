import { useMemo } from "react";

const useUserActions = (userIdx, worryIdx, commentIdx) => {
    const isMyWorry = useMemo(() => userIdx === worryIdx, [userIdx, worryIdx]);
    const isMyComment = useMemo(() => userIdx === commentIdx, [userIdx, commentIdx]);

    return { isMyWorry, isMyComment };
};

export default useUserActions;
