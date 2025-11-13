import { use, useState } from "react";
import api from "../CreatContextAPI/api";
import styles from "./writediary.module.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { requestFormReset } from "react-dom";

function Writediary() {
  const { state } = useLocation();
  const [previous, setPrevious] = useState();
  const navigate = useNavigate();
  const date = dayjs().format("YYYY-MM-DD");

  const [inputData, setInputData] = useState({
    title: "",
    content: "",
  });
  const [name, setName] = useState("");
  const [themeState, setThemeState] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputData.content.trim().length < 10) {
      alert("내용은 최소 10자 이상 입력해야 합니다.");

      return;
    }

    try {
      const response = await api.post(
        "/me/diaries",
        {
          use_theme: themeState,
          title: inputData.title,
          content: inputData.content,
        },
        { withCredentials: true },
      );
      console.log("일기 작성 성공:", response.data);
      if (response.data.previous_diaries.length > 0) {
        const result = window.confirm(
          "이 주제로 1번 이상 일기를 작성하셨습니다. 계속 작성할까요?",
        );
        if (result) {
          setPrevious(response.data.previous_diaries);
          navigate("/previous-page", { state: response.data.previous_diaries });
          return;
        } else {
          return;
        }
      }
      alert("제출 완료 ");

      goToMainPage();
    } catch (error) {
      console.error("일기 작성 실패:", error);
    }
  };
  const goToMainPage = () => {
    navigate("/");
  };
  const checkClickEvent = () => {
    setThemeState((prev) => !prev);
    console.log(themeState);
  };
  return (
    <div className={styles.BodyContainer}>
      {themeState && (
        <div className={styles.RandomBox}>
          <h3>{state.theme}</h3>
        </div>
      )}
      <div className={styles.Checkbox}>
        <input type="checkbox" onClick={checkClickEvent} />
        <label>자유 주제로 작성하기</label>
      </div>
      <form className={styles.formContain} onSubmit={handleSubmit}>
        <div className={styles.textareaContain}>
          <input
            className={styles.InputTtitle}
            name="title"
            type="text"
            placeholder="제목"
            value={inputData.title}
            onChange={handleChange}
          />
          <div className={styles.MyInfoBox}>
            <p>{date}</p>
          </div>
          <div className={styles.Line}></div>
          <br />
          <textarea
            className={styles.InputText}
            name="content"
            placeholder="내용을 입력해 주세요"
            value={inputData.content}
            onChange={handleChange}
          />
        </div>
        <button className={styles.SubmitButton} type="submit">
          저장하기
        </button>
      </form>
    </div>
  );
}

export default Writediary;
