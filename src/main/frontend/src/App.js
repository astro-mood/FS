import { BrowserRouter, Route, Routes } from "react-router-dom";
import Intro from "./pages/Intro";
import AboutAll from "./pages/AboutAll";
import AboutLogin from "./pages/AboutLogin";
import AnswerWorryDetail from "./pages/AnswerWorryDetail";
import AnswerWorryBoard from "./pages/AnswerWorryBoard";
import BoardWorry from "./pages/BoardWorry";
import DiaryCalendar from "./pages/DiaryCalendar";
import Main from "./pages/Main";
import ModifyUser from "./pages/ModifyUser";
import MyDiary from "./pages/MyDiary";
import MyWorry from "./pages/MyWorry";
import OthersWorry from "./pages/OthersWorry";
import WriteDiary from "./pages/WriteDiary";
import WriteWorry from "./pages/WriteWorry";
import Layout from "./components/layout/Layout";
import HeaderLayout from "./components/layout/HeaderLayout";
import Background from "./components/layout/Background";
import GlobalStyle from "./components/layout/GlobalStyle";

const App = () => {
    return (

        <BrowserRouter>
            <GlobalStyle />
            <Background />

            <Routes>
                <Route>
                    <Route path="/" element={<Intro />} />
                    <Route path="/aboutall" element={<AboutAll />} />
                </Route>

                <Route element={<HeaderLayout />}>
                    <Route path="/aboutlogin" element={<AboutLogin />} />
                    <Route path="/modifyuser" element={<ModifyUser />} />
                </Route>

                <Route element={<Layout />}>
                    <Route path="/answerworryboard" element={<AnswerWorryBoard />} />
                    <Route path="/answerworrydetail" element={<AnswerWorryDetail />} />
                    <Route path="/boardworry" element={<BoardWorry />} />
                    <Route path="/diarycalendar" element={<DiaryCalendar />} />
                    <Route path="/main" element={<Main />} />
                    <Route path="/mydiary" element={<MyDiary />} />
                    <Route path="/myworry" element={<MyWorry />} />
                    <Route path="/othersworry" element={<OthersWorry />} />
                    <Route path="/writediary" element={<WriteDiary />} />
                    <Route path="/writeworry" element={<WriteWorry />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
