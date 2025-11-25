import { useEffect, useState } from "react";
import styles from "./editDiary.module.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from "../CreatContextAPI/api";

function Writediary() {
  const { state } = useLocation();
  const diary = state?.diary;
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    title: diary?.title || "",
    content: diary?.content || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  const handleSubmit = async (e, id) => {
    e.preventDefault();
    if (inputData.content.trim().length < 10) {
      alert("내용은 최소 10자 이상 입력해야 합니다.");

      return;
    }

    try {
      const response = await api.patch(
        `/me/diaries/${id}`,
        {
          title: inputData.title,
          content: inputData.content,
        },
        { withCredentials: true },
      );
      console.log("일기 수정 성공:", response.data);
      alert("제출 완료 ");
      goToMainPage();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        alert("수정은 당일만 가능합니다.");
      } else {
        alert("일기 수정 중 오류가 발생했습니다.");
      }
    }
  };
  const goToMainPage = () => {
    navigate("/my-diary");
  };

  return (
    <div className={styles.BodyContainer}>
      <form
        onSubmit={(e) => handleSubmit(e, diary.id)}
        className={styles.FormCotainer}
      >
        <input
          className={styles.InputTtitle}
          name="title"
          type="text"
          placeholder="제목"
          value={inputData.title}
          onChange={handleChange}
        />
        <br />
        <div className={styles.MyInfoBox}>
          <div className={styles.NameBox}>{diary.author.full_name}</div>
          <div className={styles.DayBox}>
            {new Date(diary.created_at).toLocaleDateString("ko-KR")}
          </div>
        </div>
        <div className={styles.Line}></div>
        <br />
        <textarea
          className={styles.InputText}
          name="content"
          value={inputData.content}
          onChange={handleChange}
        />
        <br />
        <button className={styles.SubmitButton} type="submit">
          수정하기
        </button>
      </form>
    </div>
  );
}

export default Writediary;
