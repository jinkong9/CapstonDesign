import "react";
import { useEffect, useState } from "react";
import styles from "./exinfo.module.css";
import Nav from "../Nav/nav";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../CreatContextAPI/api";
import { useMyAvatar } from "../Hook/myavatar";

function ExInfo() {
  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    registered_at: "",
    diary_count: "",
  });

  const [isHide, setIsHide] = useState(false); // ✅ 비공개 여부 상태
  const avatar = useMyAvatar();
  const location = useLocation();
  const navigate = useNavigate();
  const diary = location.state?.diary;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${diary.author.id}`);

        console.log(" 전체 응답 데이터:", response.data);
        console.log(" user_info 값:", response.data.user_info);
        console.log(" isHide 값:", response.data.isHide);

        const { isHide } = response.data;

        if (isHide === true || isHide === "true" || isHide === 1) {
          console.log("비공개 계정입니다. user_info 접근하지 않음.");
          setIsHide(true);
          alert("이 사용자의 정보는 비공개로 설정되어 있습니다.");

          setUserData({
            full_name: "",
            email: "",
            registered_at: "",
            diary_count: "",
          });
          return;
        }

        const { full_name, email, registered_at, diary_count } =
          response.data.user_info;

        setIsHide(false);
        setUserData({
          full_name,
          email,
          registered_at: registered_at.slice(0, 10),
          diary_count,
        });
      } catch (error) {
        console.log("유저 정보 불러오기 오류", error);
        if (error.response) {
          console.log(" 에러 응답 데이터:", error.response.data);
          console.log(" 상태 코드:", error.response.status);
        }
      }
    };

    if (diary?.author?.id) fetchUserData();
  }, [diary, navigate]);

  return (
    <div className={styles.Container}>
      <div className={styles.InfoContainer}>
        <div className={styles.Titlebox}>사용자 프로필 및 정보</div>

        <div className={styles.MySecurityBox}>
          {isHide ? (
            <div className={styles.LockBox}>
              <img src="/lock.png" alt="locked" className={styles.LockImg} />
            </div>
          ) : (
            <div className={styles.ImgInfoFlex}>
              <img
                src={`https://daisy.wisoft.io/yehwan/app1/avatars/${diary.author.avatar}`}
                className={styles.ProfileBox}
                alt="user-avatar"
              />

              <div className={styles.InfoFlex}>
                <div className={styles.Infobox}>
                  <p>이름:</p>
                  <p>이메일:</p>
                  <p>가입 날짜:</p>
                  <p>등록된 일기:</p>
                </div>
                <div className={styles.Infobox2}>
                  <p>{userData.full_name}</p>
                  <p>{userData.email}</p>
                  <p>{userData.registered_at}</p>
                  <p>{userData.diary_count}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {!isHide && (
        <div className={styles.MyDIaryStateContianer}>
          <div className={styles.Titlebox2}>사용자 활동</div>
          <div className={styles.RecentActivityBox}>
            <img src="./diary.png" className={styles.DiaryImg} alt="diary" />
            <Link
              to="/users-diaries"
              state={{ diary }}
              className={styles.MyDiaryLink}
            >
              사용자의 일기 확인하기
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExInfo;
