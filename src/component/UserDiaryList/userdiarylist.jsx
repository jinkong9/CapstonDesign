import React from "react";
import Nav from "../Nav/nav";
import styles from "./userdiarylist.module.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../CreatContextAPI/api";
import { useModalContext } from "../CreatContextAPI/modalContext";
import ModalPage from "../Modal/modal";
import { useNavigate } from "react-router-dom";

function UserDiaryList() {
  const navigate = useNavigate();

  const { modalState, SetModalState } = useModalContext();

  const [searchKeyword, SetSearchKeyword] = useState("");
  const [diaryList, setDiaryList] = useState([]);
  const [sortState, setSortState] = useState("new");

  const filterDiaryList = [...diaryList].filter((diary) =>
    diary.title.includes(searchKeyword)
  );
  const sortDiaryList = [...filterDiaryList].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    return sortState === "new" ? dateB - dateA : dateA - dateB;
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/diaries/recent?offset=0&limit=12");
        console.log(response.data.diaries);
        setDiaryList(response.data.diaries);
      } catch (error) {
        console.error("최근 사용자 일기 get 에러", error);
      }
    };
    fetchData();
  }, []);
  const GoToUserPage = (diary) => {
    navigate("/exinfo", { state: { diary: diary } });
  };

  useEffect(() => {
    const responseData = async () => {
      try {
        const response = await Promise.all(
          diaryList.map((diary) =>
            api.get(`/avatars/${diary.author.avatar}`, {
              withCredentials: true,
            })
          )
        );

        console.log("프로필 불러오기 성공!");
        console.log("avatar 값:", avatar);
      } catch (error) {
        console.log("프로필 불러오기 오류");
      }
    };
    responseData();
  }, []);

  return (
    <>
      <main className={styles.MainContainer}>
        <h2 className={styles.MainTitle}>다른 사람들이 쓴 일기에요!</h2>
        <input
          placeholder="제목을 입력하세요"
          type="text"
          value={searchKeyword}
          onChange={(e) => SetSearchKeyword(e.target.value)}
          className={styles.TitleInputBox}
        />
        <div className={styles.color}>
          <div
            className={styles.SortButton}
            onClick={() =>
              sortState === "new" ? setSortState("old") : setSortState("new")
            }
          >
            {sortState === "new" ? "최신 순" : "오래된 순"}
          </div>

          <div className={styles.DailyListWrapper}>
            {sortDiaryList.map((diary, index) => (
              <div
                key={index}
                className={styles.DaliyBox}
                onClick={() => SetModalState(diary)}
              >
                <div className={styles.MyProfile}>
                  <img
                    className={styles.MyProfileImg}
                    onClick={() => GoToUserPage(diary)}
                    src={`https://daisy.wisoft.io/yehwan/app1/avatars/${diary.author.avatar}`}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  ></img>
                </div>
                <p className={styles.DaliyTitleText}>
                  {diary.author.full_name}님의 일기
                </p>
                <div className={styles.maintest}>
                  <span className={styles.DateText}>
                    {new Date(diary.created_at).toLocaleDateString("ko-KR", {
                      timeZone: "Asia/Seoul",
                    })}
                  </span>
                  <span className={styles.DaliyTitle2Text}>
                    {diary.title.length > 8
                      ? diary.title.substring(0, 8) + ".."
                      : diary.title}
                  </span>
                </div>
                <div className={styles.Line}></div>
                <div className={styles.DaliyContentText}>
                  {diary.content.length > 10
                    ? diary.content.substring(0, 10) + ".."
                    : diary.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {modalState && <ModalPage />}
    </>
  );
}
export default UserDiaryList;
