import React, { useEffect, useState } from "react";
import Title from "../components/board/PostTitle";
import Content from "../components/board/PostContent";
import CommentList from "../components/comment/CommentList";
import CommentInput from "../components/comment/CommentInput";
import styled from "styled-components";
import { getWorryByIdx, updateWorry, deleteWorry, resolveChangeWorry } from "../api/api";
import { useParams } from "react-router";
import { useUser } from "../context/UserContext";


const ViewWorry = () => {
    const { userIdx, nickname, profileImage,  } = useUser();
    console.log("지금 로그인한 회원 userIdx", userIdx)
    console.log("지금 로그인한 회원 nickname : ", nickname);
    console.log("지금 로그인한 회원 profileImage : ", profileImage);

    const { worryIdx } = useParams();
    const [worry, setWorry] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedWorry, setEditedWorry] = useState({ title: "", content: "" });

    const [comments, setComments] = useState([
        { id: 1, text: "저도 그럴 때가 있었어요. 힘내세요!", ownerId: 2, likes: 15 },
        { id: 2, text: "공감합니다!", ownerId: 3, likes: 8 },
    ]);
    const [newComment, setNewComment] = useState(""); // 댓글 입력 상태

    const handleAddComment = () => {
        if (!newComment.trim()) return; // 빈 댓글 방지
        const newCommentData = {
            id: Date.now(), // 임시 ID (백엔드와 연동 시 수정 필요)
            text: newComment,
            ownerId: userIdx,
            likes: 0,
        };
        setComments((prev) => [...prev, newCommentData]);
        setNewComment("");
    };

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

    useEffect(() => {
        if (worryIdx) {
            fetchWorry();
        }
    }, [worryIdx]);

    if (!worry) {
        return <div>Loading...</div>;
    }

    console.log("고민글 쓴 userIdx:", worry.userIdx);
    const isOwner = userIdx === worry.userIdx; // 현재 사용자가 작성자인지 판단

    return (
        <Container>
            <Board>고민상담소</Board>
            <ContentsContainer>
                {isEditing ? (
                    <EditForm>
                        <EditInput
                            name="title"
                            value={editedWorry.title}
                            onChange={handleEditChange}
                            placeholder="제목을 입력하세요"
                        />
                        <EditTextarea
                            name="content"
                            value={editedWorry.content}
                            onChange={handleEditChange}
                            placeholder="내용을 입력하세요"
                        />
                        <EditActions>
                            <ActionButton onClick={handleEditSave}>저장하기</ActionButton>
                            <ActionButton onClick={handleEditToggle}>취소하기</ActionButton>
                        </EditActions>
                    </EditForm>
                ) : (
                    <>
                        <Title title={worry.title} createdAt={worry.createdAt} />
                        <p>조회수: {worry.viewCount}</p>
                        <Content content={worry.content} />
                    </>
                )}
                {isOwner && !isEditing && (
                    <FlexRow>
                        <ActionButton onClick={handleEditToggle}>수정하기</ActionButton>
                        <ActionButton onClick={handleDelete}>삭제하기</ActionButton>
                        <Dropdown
                            onChange={handleResolveChange}
                            defaultValue={worry.isResolved ? "해결 완료" : "진행 중"}
                        >
                            <option value="진행 중">진행 중</option>
                            <option value="해결 완료">해결 완료</option>
                        </Dropdown>
                    </FlexRow>
                )}
                <Spacer />
                <CommentList
                    comments={comments}
                    userIdx={userIdx}
                    onLike={(id) =>
                        setComments((prev) =>
                            prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
                        )
                    }
                    onEdit={(id, newText) =>
                        setComments((prev) =>
                            prev.map((c) => (c.id === id ? { ...c, text: newText } : c))
                        )
                    }
                    onDelete={(id) => setComments((prev) => prev.filter((c) => c.id !== id))}
                    onReport={(id) => alert(`댓글 ${id} 신고 완료.`)}
                />
                <CommentInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onSubmit={handleAddComment}
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

const FlexRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
    margin-bottom: 20px;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const Dropdown = styled.select`
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

const EditForm = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const EditInput = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const EditTextarea = styled.textarea`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: none;
`;

const EditActions = styled.div`
    display: flex;
    gap: 10px;
`;
