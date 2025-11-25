import React from "react";
import Nav from "../Nav/nav";
import styles from "./usersdiarylist.module.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../CreatContextAPI/api";
import { useModalContext } from "../CreatContextAPI/modalContext";
import ModalPage from "../Modal/modal";

function UsersDiaryList() {
  const location = useLocation();
  const diary = location.state?.diary;

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
        const response = await api.get(`/users/${diary.author.id}/diaries`);
        setDiaryList(response.data.diaries);
      } catch (error) {
        console.error("최근 사용자 일기 get 에러", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <main className={styles.MainContainer}>
        <h2 className={styles.MainTitle}>
          {diary.author.full_name}님의 일기에요!
        </h2>
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
                <p className={styles.DaliyTitleText}>
                  {diary.author.full_name}님의 일기
                </p>
                <span className={styles.DaliyTitle2Text}>
                  {diary.title.length > 10
                    ? diary.title.substring(0, 10) + "..."
                    : diary.title}
                </span>
                <span className={styles.DateText}>
                  {new Date(diary.created_at).toLocaleDateString("ko-KR", {
                    timeZone: "Asia/Seoul",
                  })}
                </span>
                <div className={styles.Line}></div>
                <div className={styles.DaliyContentText}>
                  {diary.content.length > 10
                    ? diary.content.substring(0, 10) + "..."
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
export default UsersDiaryList;
