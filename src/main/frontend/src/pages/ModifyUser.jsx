import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import MediaQuery from '../components/layout/MediaQuery';
import { useNavigate } from "react-router";
import Modal from "../components/modal/Modal";
import ConfirmModal from "../components/modal/ConfirmModal";
import { useUser } from '../context/UserContext';
import axios from 'axios';
import {getUserInfo,withdrawUser} from "../api/api";
import ReadOnlyInputBox from "../components/userInfo/ReadOnlyInputBox";
import InputBox from "../components/userInfo/InputBox";

const ModifyUser = () => {

    const navigate = useNavigate();
    const { userIdx, setNickname, setProfileImage } = useUser();

    // 유효성 상태
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [isNicknameValid, setIsNicknameValid] = useState(true);

    // Confirm 모달 관련
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalMessage, setConfirmModalMessage] = useState("");
    // 모달 관련
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const [imgFile, setImgFile] = useState("");
    const imgRef = useRef();
    const [userData, setUserData] = useState({});
    const [form, setForm] = useState({
        userIdx: null,
        nickname: "",
        phone: "",
        profileImage: "",
        oauthProvider: "",
        email: "",
    });

    useEffect(() => {
        // userIdx가 undefined인 경우 처리
        if (!userIdx) {
            console.log("사용자 정보가 없습니다.");
            return; // 더 이상 진행하지 않음
        }
        const fetchUserData = async () => {
            try {
                const response = await getUserInfo(userIdx);
                const user = response.data;
                setUserData(user);
                setForm({
                    userIdx: user.userIdx,
                    nickname: user.nickname,
                    profileImage: user.profileImage,
                    email: user.email,
                    phone: (user.phone)? user.phone : "",
                    oauthProvider: user.oauthProvider,
                });
                setImgFile(user.profileImage);
            } catch (error) {
                console.error("API 요청 에러:", error);
                throw error;
            }
        }
        fetchUserData();
    }, [userIdx]);

    // 이미지 업로드 input의 onChange
    const saveImgFile = () => {
        const { files } = imgRef.current;
        // 파일 첨부 도중에 취소를 누를 경우 에러가 발생하지 않도록 return 처리
        if (files.length === 0) {
            return
        }

        const file = files[0];
        // 파일 타입 확인 (이미지 파일인지)
        const validImageTypes = ['image/jpeg', 'image/png'];
        if (!validImageTypes.includes(file.type)) {
            setConfirmModalMessage("JPG, JPEG, PNG 파일만 업로드 가능합니다.");
            setIsConfirmModalOpen(true);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgFile(reader.result);
        };
    };


    // 휴대폰 번호 유효성 검사
    const validatePhoneNumber = (phone) => {
        const phoneRegExp = /^0[0-9]{10}$/; // 0으로 시작하고 총 11자리 숫자
        return phoneRegExp.test(phone);
    };

    const onChangePhone = (e) => {
        let currentPhone = e.target.value;
        // 숫자만 남기고 나머지 문자는 빈 문자열로 변환
        currentPhone = currentPhone.replace(/[^0-9]/g, '');
        e.target.value = currentPhone;
        if (currentPhone === "") {
            setIsPhoneValid(true); // 공란일 경우 유효하다고 설정
        } else if (!validatePhoneNumber(currentPhone)) {
            setIsPhoneValid(false);
        } else {
            setIsPhoneValid(true);
        }
        handleInputChange(e);
    };

    // 닉네임 유효성 검사
    const onChangeNickname = (e) => {
        let currentNickname = e.target.value;
        // 닉네임이 10자 이하일 경우에만 상태 업데이트
        if (currentNickname.length <= 10) {
            setIsNicknameValid(true);
            e.target.value = currentNickname;
        } else {
            setIsNicknameValid(false); // 10자 초과 시 유효하지 않음
            return;
        }
        handleInputChange(e);
    };

    const handleUpdate =  async (e) => {
        e.preventDefault();
        // 사용자 정보 업데이트 로직 구현
        if (!form.nickname) {
            showConfirmModal("닉네임을 입력해주세요!");
            return;
        }else if(!isNicknameValid){
            showConfirmModal("닉네임은 10글자 이내로 입력해주세요!");
            return;
        }
        if (form.phone && !isPhoneValid){
            showConfirmModal("연락처를 확인해주세요!");
            return;
        }

        try {
            const formData = new FormData();
            // 이미지가 존재하면 추가
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                formData.append("profileImage", file);
            }
            Object.keys(form).forEach((key) => {
                if(key !== "oauthProvider" && key !== "email"){
                    formData.append(key, form[key]);
                }
            });

            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:8080/api/user/${userIdx}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // 전역 상태로 user 업데이트
            setNickname(response.data.data.nickname);
            setProfileImage(response.data.data.profileImage);


            showConfirmModal("수정이 완료되었습니다!");
        } catch (error) {
            console.error("정보 수정 실패:", error);
            alert("정보 수정 중 오류가 발생했습니다.");
        }
    };

    const handleWithdrawModal = (e) => {
        e.preventDefault();
        setModalMessage("모든 기록을 잃게됩니다. \n정말로 탈퇴하시겠습니까?");
        setIsModalOpen(true);
    };

    const handleConfirm = async () => {
        // 회원 탈퇴 로직 구현
        await withdrawUser(userIdx);
        setIsModalOpen(false);
        navigate("/"); //인트로화면으로 이동
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsConfirmModalOpen(false);
    };

    // input 필드의 값 변경 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value, // 동적으로 상태 업데이트
        });
    };

    const showConfirmModal = (message) => {
        setConfirmModalMessage(message);
        setIsConfirmModalOpen(true);
    };
    if (!userData.userIdx) {
        return <LoadingDiv>Loading...</LoadingDiv>;
    }
    return (
        <Container>
            <ContainerInnerDiv>
                <Board>유저정보</Board>
                <form>
                    <FormInnerDIV>
                        <ProfileImgSection>
                            <ProfileImage  src={imgFile} alt="프로필 이미지"  />
                            <FileUploadLabel htmlFor="profileImg">이미지 수정</FileUploadLabel>
                            <FileUploadInput
                                type="file"
                                accept="image/jpeg, image/png"
                                id="profileImg"
                                onChange={saveImgFile}
                                ref={imgRef}
                            />
                        </ProfileImgSection>

                        <InfoSection>
                            <InputBox
                                label="닉네임" name="nickname"
                                value={form.nickname}
                                onChange={onChangeNickname}
                                isValid={isNicknameValid}
                                message={"10자이내로 입력해주세요."}
                            />
                            <InputBox
                                label="연락처" name="phone"
                                value={form.phone}
                                onChange={onChangePhone}
                                isValid={isPhoneValid}
                                message={"휴대번호를 - 없이 11자로 입력해주세요."}
                            />
                            <ReadOnlyInputBox
                                label="계정 연동 정보" name="nickname" value={form.oauthProvider}
                            />
                            <ReadOnlyInputBox
                                label="이메일" name="email" value={form.email}
                            />
                        </InfoSection>
                    </FormInnerDIV>
                    <UpdateButton onClick={handleUpdate}>수정하기</UpdateButton>
                </form>
            </ContainerInnerDiv>

            <WithdrawButton onClick={handleWithdrawModal}>회원탈퇴</WithdrawButton>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                message={confirmModalMessage}
                onConfirm={handleCancel}
            />

            <Modal
                isOpen={isModalOpen}
                message={modalMessage}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />

        </Container>
    );
};

export default ModifyUser;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
    margin-top: -1.25rem;
    min-height: 97%;
`;

const ContainerInnerDiv = styled.div`
    flex: 1;
`;

const Board = styled.h1`
    color: white;
    font-size: 1.8rem;
    margin-bottom: 1.25rem;
    text-align: left;
`;
const LoadingDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    flex: 1;
`;
const FormInnerDIV = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items : start;
    margin-top: 2rem;
    flex-wrap: wrap;
`;
const ProfileImgSection = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 12.5rem;

    ${MediaQuery.mobile`
        align-items: center;
        width: 100%;
    `}
`;

const ProfileImage = styled.img`
    width: 7.5rem;
    height: 7.5rem;
    border-radius: 50%;
    object-fit: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(125, 141, 222, 0.43);
`;

const FileUploadLabel = styled.label`
    margin: 1.25rem 0;
    font-weight: bold;
    color: #7D8DDE;
    display: inline-block;
    cursor: pointer;
`;
const FileUploadInput = styled.input`
    display: none;
`;

const InfoSection = styled.section`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 2rem;
    margin: 3rem 0 2rem;
    ${MediaQuery.mobile`
        align-items: center;
        width: 100%;
        gap: 1.5rem;
        margin-top: 1.5rem;
    `}
`;

const WithdrawButton = styled.button`
    border: none;
    outline: none;
    background: none;
    color:#000;
    font-size: 0.875rem;
    padding: 0.625rem 1rem;
    align-self: end;
    cursor: pointer;
    font-family: inherit;
    &:hover {color:#7D8DDE;}
`;

const UpdateButton = styled.button`
    border: none;
    outline: none;
    color:#fff;
    background-color: #7D8DDE;
    font-size: 1.25rem;
    padding: 0.625rem 2.25rem;
    cursor: pointer;
    display: block;
    margin: 1.875rem auto;
    border-radius: 3.125rem;
    font-family: inherit;
    &:hover {background-color:#4E2850;}
    &:disabled {opacity: 0.3}
`;
