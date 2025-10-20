import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./component/Nav/nav";
import Main from "./component/Main/main/main";
import Login from "./component/Login/login/login";
import Join from "./component/Join/join";
import MyCalendar from "./component/Calendar/calendar";
import Changepw from "./component/Changepw/changepw";
import UserDiaryList from "./component/UserDiaryList/userdiarylist";
import UserInfo from "./component/Userrinfo/userinfo";
import Profilepage from "./component/Profile/profile";
import Writediary from "./component/WriteDiary/writediary";
import MyDiaryList from "./component/Mydiary/mydiary";
import MyEditDiary from "./component/Mydiary/editDiary";
import ModalPage from "./component/Modal/modal";
import { ModalProvider } from "./component/CreatContextAPI/modalContext";
import UsersDiaryList from "./component/UserDiaryList/usersdiarylist";
import AuthProvider from "./component/CreatContextAPI/context";
import Layout from "./component/Layout/layout";
import ExInfo from "./component/Userrinfo/exinfo";
import Previous from "./component/Previous/previous";
import { CookiesProvider } from "react-cookie";

function App() {
  return (
    <BrowserRouter>
      <CookiesProvider>
        <AuthProvider>
          <ModalProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Main />} />
                <Route path="/calendar" element={<MyCalendar />} />
                <Route path="/user-info" element={<UserInfo />} />
                <Route path="/exinfo" element={<ExInfo />} />
                <Route path="/user-diaries" element={<UserDiaryList />} />
                <Route path="/users-diaries" element={<UsersDiaryList />} />
              </Route>
              <Route path="/join" element={<Join />} />
              <Route path="/login" element={<Login />} />
              <Route path="/changepw" element={<Changepw />} />
              <Route path="/write-diary" element={<Writediary />} />
              <Route path="/profile" element={<Profilepage />} />
              <Route path="/my-diary" element={<MyDiaryList />} />
              <Route path="/edit-diary" element={<MyEditDiary />} />
              <Route path="/modal" element={<ModalPage />} />
              <Route path="/previous-page" element={<Previous />} />
            </Routes>
          </ModalProvider>
        </AuthProvider>
      </CookiesProvider>
    </BrowserRouter>
  );
}

export default App;
