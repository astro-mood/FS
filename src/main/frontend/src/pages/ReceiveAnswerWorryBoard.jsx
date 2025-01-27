import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useUser } from '../context/UserContext';
import {getReceiveAnswer} from "../api/api";

const ReceiveAnswerWorryBoard = () => {
    const hello = "내가 받은 답변보기 (리스트)";
    return hello;
};

export default ReceiveAnswerWorryBoard;