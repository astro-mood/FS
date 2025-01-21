import React, { useEffect, useState } from "react";
import Title from "../components/board/PostTitle";
import Content from "../components/board/PostContent";
import CommentList from "../components/comment/CommentList";
import CommentInput from "../components/comment/CommentInput";
import styled from "styled-components";
import {
    getWorryByIdx,
    updateWorry,
    deleteWorry,
    resolveChangeWorry,
    getWorryComment,
    postWorryComment,
    updateWorryComment, deleteWorryComment, reportWorryComment
} from "../api/api";
import { useParams } from "react-router";
import { useUser } from "../context/UserContext";
import WorryEditForm from "../components/board/WorryEditForm";
import OwnerAction from "../components/button/EditDeleteButton";
import ResolveDropdown from "../components/dropdown/ResolveDropdown";

const ViewWorry = () => {
    const { userIdx  } = useUser();

    const { worryIdx } = useParams();
    const [worry, setWorry] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedWorry, setEditedWorry] = useState({ title: "", content: "" });

    const [comments, setComments] = useState();
    const [editedComment, setEditedComment] = useState({ id: null, content: "" });
    const [newComment, setNewComment] = useState("");

    const fetchWorry = async () => {
        try {
            const data = await getWorryByIdx(worryIdx);
            setWorry(data);
            setEditedWorry({ title: data.title, content: data.content });
        } catch (error) {
            console.error("고민 데이터를 불러오는 데 실패했습니다.", error);
        }
    };

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedWorry((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async () => {
        try {
            const updatedData = {
                ...worry, // 기존 worry의 모든 것 포함
                title: editedWorry.title,
                content: editedWorry.content,
            };
            await updateWorry(worryIdx, updatedData);
            setWorry((prev) => ({ ...prev, ...updatedData }));
            setIsEditing(false);
            alert("수정되었습니다.");
        } catch (error) {
            console.error("수정에 실패했습니다.", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await deleteWorry(worryIdx);
                alert("삭제되었습니다.");
                window.location.href = "/boardworry";
            } catch (error) {
                console.error("삭제에 실패했습니다.", error);
            }
        }
    };

    const handleResolveChange = async (e) => {
        const newStatus = e.target.value === "해결 완료";
        try {
            await resolveChangeWorry(worryIdx, { isResolved: newStatus });
            setWorry((prev) => ({ ...prev, isResolved: newStatus }));
            alert("상태가 변경되었습니다.");
        } catch (error) {
            console.error("상태 변경에 실패했습니다.", error);
        }
    };

    // comment 관련
    // 댓글 데이터 불러오기
    const fetchWorryComment = async () => {
        try {
            const response = await getWorryComment(worryIdx)
            console.log("댓글 API 응답:", response.data.content);  // 실제로 찍어보기
            setComments(response.data.content);
        } catch (error) {
            console.error("댓글 데이터를 불러오는 데 실패했습니다.", error);
        }
    };

    useEffect(() => {
        if (worryIdx) {
            fetchWorry();
            fetchWorryComment();

        }
    }, [worryIdx]);

    if (!worry) {
        return <div>Loading...</div>;
    }

    const isOwner = userIdx === worry.userIdx; // 현재 사용자가 작성자인지 판단

    // 댓글 추가
    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const data = { content: newComment }; // 전송할 데이터 형식
            const response = await postWorryComment(worryIdx, data);
            setComments((prev) => [...prev, response]);
            setNewComment("");
            fetchWorryComment();
        } catch (error) {
        }
    };

    // 댓글 수정
    const handleCommentEdit = async (commentIdx, newContent) => {
        try {
            await updateWorryComment(commentIdx, { content: newContent });
            fetchWorryComment();
            setEditedComment({ id: null, content: "" });
            alert("댓글이 수정되었습니다.");
        } catch (error) {
            console.error("댓글 수정에 실패했습니다.", error);
        }
    };

    // 댓글 삭제
    const handleCommentDelete = async (commentIdx) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await deleteWorryComment(commentIdx);
                fetchWorryComment();
                alert("댓글이 삭제되었습니다.");
            } catch (error) {
                console.error("댓글 삭제에 실패했습니다.", error);
            }
        }
    };

    // 댓글 신고
    const handleCommentReport = async (commentIdx) => {
        if (window.confirm("정말 신고하시겠습니까?")) {
            try {
                console.log("신고 요청 데이터:", { commentIdx }); // 요청 데이터 로그
                await reportWorryComment(commentIdx);
                console.log("신고 성공:");
                // fetchWorryComment();
                alert("댓글이 신고되었습니다.");
            } catch (error) {
                console.error("댓글 신고에 실패했습니다.", error);
            }
        }
    };

    return (
        <Container>
            <Board>고민상담소</Board>
            <ContentsContainer>
                {isEditing ? (
                    <WorryEditForm
                        editedWorry={editedWorry}
                        handleEditChange={handleEditChange}
                        handleEditSave={handleEditSave}
                        handleEditToggle={handleEditToggle}
                    />
                ) : (
                    <>
                        <Title title={worry.title} createdAt={worry.createdAt} />
                        <DropdownContainer>
                            <ViewCount>조회수: {worry.viewCount}</ViewCount>
                            {isOwner && !isEditing ? (
                                <ResolveDropdown
                                    onChange={handleResolveChange}
                                    isResolved={worry.isResolved}
                                />
                            ) : (
                                <StatusText>
                                    {worry.isResolved ? "🚀 고민 해결 완료" : "🪐 고민 진행 중"}
                                </StatusText>
                            )}
                        </DropdownContainer>
                        <Content content={worry.content} />
                    </>
                )}
                {isOwner && !isEditing && (
                    <OwnerAction
                        handleEditToggle={handleEditToggle}
                        handleDelete={handleDelete}
                    />
                )}
                <Spacer />
                <CommentList
                    comments={comments}
                    userIdx={userIdx}
                    onReport={handleCommentReport}
                    onEdit={handleCommentEdit}
                    onDelete={handleCommentDelete}
                />
                <CommentInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onSubmit={(content) => {
                        handleAddComment(content);
                    }}
                    placeholder="위로의 말을 건네세요."
                />
            </ContentsContainer>
        </Container>
    );
};

export default ViewWorry;

const Container = styled.div`
    flex-direction: column;
    padding: 20px;
    margin-top: -20px;
`;

const Board = styled.h1`
    color: white;
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: left;
`;

const ContentsContainer = styled.div`
    height: calc(100vh - 180px);
    overflow-y: auto;
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    scrollbar-width: none;
`;

const Spacer = styled.div`
    height: 30px;
`;

const DropdownContainer = styled.h1`
    display: flex;
    justify-content: space-between; 
    align-items: center;
    margin: 10px 0;
`;

const ViewCount = styled.h1`
    color: #7A7A7A;
    font-size: 1rem;
    margin-bottom: 20px;
    text-align: left;
    margin: 0;
`;

const StatusText = styled.div`
  font-family: 'NeoDunggeunmo';
  font-size: 1rem;
  color: #535252;
  margin: 0;
`;