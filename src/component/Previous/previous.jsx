import React, { useState } from "react";
import styles from "./previous.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useModalContext } from "../CreatContextAPI/modalContext";
import ModalPage from "../Modal/modal";

function Previous() {
  const location = useLocation();
  const previousDiaries = location.state || [];
  const { modalState, SetModalState } = useModalContext();
  const navigate = useNavigate();
  const [sortState, setSortState] = useState("new");

  const sortDiaryList = [...previousDiaries].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortState === "new" ? dateB - dateA : dateA - dateB;
  });

  const deleteDiary = async (id) => {
    const confirmDelete = window.confirm("삭제하시겠습니까?");
    if (!confirmDelete) return;
    alert("삭제가 완료되었습니다");
  };

  const goToEditPage = (diary) => {
    navigate("/edit-diary", { state: { diary } });
  };

  return (
    <>
      <main className={styles.MainContainer}>
        <div className={styles.gap}>
          <h2 className={styles.MainTitle}>오늘 주제로 작성된 일기</h2>
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
              {sortDiaryList.map((diary) => (
                <div
                  onClick={() => SetModalState(diary)}
                  key={diary.id}
                  className={styles.DaliyBox}
                >
                  <p className={styles.DaliyTitleText}>
                    {diary.author.full_name}님의 일기
                  </p>
                  <span className={styles.DaliyTitle2Text}>
                    {diary.title.length > 10
                      ? diary.title.substring(0, 8) + "..."
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
        </div>
      </main>
      {modalState && <ModalPage />}
    </>
  );
}

export default Previous;
