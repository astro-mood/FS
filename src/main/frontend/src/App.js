import { BrowserRouter, Route, Routes } from "react-router-dom";
import Intro from "./pages/Intro";
import AboutAll from "./pages/AboutAll";
import AboutLogin from "./pages/AboutLogin";
import AnswerWorryDetail from "./pages/AnswerWorryDetail";
import AnswerWorryBoard from "./pages/AnswerWorryBoard";
import BoardWorry from "./pages/BoardWorry";
import ViewDiary from "./pages/ViewDiary";
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
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from "./context/UserContext";

const App = () => {
    return (
    <UserProvider>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}>
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
                </Route>

                <Route element={<Layout />}>
                    <Route path="/modifyuser" element={<ModifyUser />} />
                    <Route path="/answerworryboard" element={<AnswerWorryBoard />} />
                    <Route path="/answerworrydetail" element={<AnswerWorryDetail />} />
                    <Route path="/boardworry" element={<BoardWorry />} />
                    <Route path="/viewdiary" element={<ViewDiary />} />
                    <Route path="/main" element={<Main />} />
                    <Route path="/mydiary" element={<MyDiary />} />
                    <Route path="/myworry" element={<MyWorry />} />
                    <Route path="/worry/:worryIdx" element={<OthersWorry />} />
                    <Route path="/writediary" element={<WriteDiary />} />
                    <Route path="/writeworry" element={<WriteWorry />} />
                </Route>
            </Routes>
        </BrowserRouter>
        </GoogleOAuthProvider>
    </UserProvider>
    );
};

export default App;
