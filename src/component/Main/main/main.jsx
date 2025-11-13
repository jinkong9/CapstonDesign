import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./main.module.css";
import { useNavigate } from "react-router-dom";
import api from "../../CreatContextAPI/api";
import { handleError } from "../../Hook/auth";
import { setQuarter } from "date-fns";

function Main() {
  const navigate = useNavigate();
  const [text, setText] = useState("일기 주제 텍스트");
  const [diaryList, setDiaryList] = useState([]);
  const [login, setLogin] = useState(false);
  const [userAvatar, setUserAvatar] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/themes/today");
        setText(response.data.theme);
        setCount(response.data.count);
      } catch (error) {
        console.error("get요청 실패", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await api.get("/me");
        if (res.data) {
          setLogin(true);
        }
      } catch (err) {
        setLogin(false);
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/diaries/recent");
        setDiaryList(response.data.diaries);
        const avatars = response.data.diaries.map(
          (diary) => diary.author.avatar,
        );
        setUserAvatar(avatars);
        setQuarter;
      } catch (error) {
        console.error("최근 사용자 일기 get 에러", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const responseData = async () => {
      try {
        await Promise.all(
          diaryList.map((diary) => api.get(`/avatars/${diary.author.avatar}`)),
        );
      } catch (error) {
        console.log("avatar없음");
      }
    };
    responseData();
  }, [diaryList]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: Math.max(1, Math.min(diaryList.length || 1, 3)),
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 769, settings: { slidesToShow: 2 } },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, centerMode: false, centerPadding: "0px" },
      },
    ],
  };

  const GoToUserListPage = () => {
    navigate("/user-diaries", { state: { diaryListData: diaryList } });
  };

  const GoToUserPage = (diary) => {
    navigate("/exinfo", { state: { diary: diary } });
  };

  const gotowrite = async () => {
    try {
      const res = await api.get("/me");
      if (res.data) {
        navigate("/write-diary", { state: { theme: text } });
      }
    } catch (err) {
      await handleError(err, navigate);
    }
  };

  return (
    <>
      <div className={styles.SubNavBox}>
        <p className={styles.SubText}>오늘은 어떤 이야기를 들려주시나요?</p>
      </div>
      <header className={styles.Header}>
        <h2 className={styles.HeadText}>오늘의 주제!</h2>
        <div className={styles.HeadBox}>
          <h3 className={styles.HeadBoxText}>{text}</h3>
          <p className={styles.Prompt}>
            {login
              ? ` 이 주제로 사용자들이 ${count}번 작성했어요.`
              : "로그인 후 이용해 주세요."}
          </p>
          <div onClick={gotowrite} className={styles.WriteButton}>
            일기 작성하기
            <img className={styles.ButtonImage} src="/pen.png" />
          </div>
        </div>
      </header>

      <main className={styles.MainContainer}>
        <div className={styles.Maintop}>
          <h2 className={styles.MainText}>최근 사람들이 쓴 일기에요!</h2>
          <button onClick={GoToUserListPage} className={styles.UserInfoButton}>
            사용자 둘러보기
          </button>
        </div>
        <Slider
          key={diaryList.length}
          {...settings}
          className={styles.SliderContainer}
        >
          {diaryList.map((diary, index) => (
            <div key={index}>
              <div className={styles.DaliyBox}>
                <div className={styles.MyProfile}>
                  <img
                    className={styles.MyProfileImg}
                    onClick={() => GoToUserPage(diary)}
                    src={`https://daisy.wisoft.io/yehwan/app1/avatars/${diary.author.avatar}`}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <p className={styles.DaliyTitleText}>
                  {diary.author.full_name}님의 일기
                </p>
                <div className={styles.maintest}>
                  <span className={styles.DaliyDateText}>
                    {new Date(diary.created_at).toLocaleDateString("ko-KR", {
                      timeZone: "Asia/Seoul",
                    })}
                  </span>
                  <span className={styles.DaliyTitle2Text}>
                    {diary.title.length > 10
                      ? diary.title.substring(0, 10) + "..."
                      : diary.title}
                  </span>
                </div>
                <div className={styles.Line}></div>
                <div className={styles.DaliyContentText}>
                  {diary.content.length > 10
                    ? diary.content.substring(0, 10) + "..."
                    : diary.content}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </main>

      <h2 className={styles.FooterTitleText}>
        여러분의 소중한 추억을 작성하고 공유해요!
      </h2>
      <footer className={styles.footerCnontainer}>
        <div className={styles.FooterBox}>
          <img className={styles.FooterImg} src="/footer1.png" alt="" />
          <p className={styles.Footertext}>
            매일 렌덤으로 뽑아주는 주제를 통해 <br />
            나만의 일기를 간편하게 작성해 봐요!
          </p>
        </div>
        <div className={styles.FooterBox}>
          <img className={styles.FooterImg} src="/footer2.png" alt="" />
          <p className={styles.Footertext}>
            철저한 보안으로 당신의 일기를 보호할 <br />수 있어요!
          </p>
        </div>
        <div className={styles.FooterBox}>
          <img className={styles.FooterImg} src="/footer3.png" alt="" />
          <p className={styles.Footertext}>
            내가 작성한 일기를 공유하면서 다른 <br />
            사람의 일기도 볼 수 있어요!
          </p>
        </div>
      </footer>
    </>
  );
}

export default Main;
