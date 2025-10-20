import React, { useEffect, useState } from "react";
import style from "./join.module.css";
import { useNavigate } from "react-router-dom";
import api from "../CreatContextAPI/api";

export default function Join() {
  const [info, setInfo] = useState({
    email: "",
    full_name: "",
    password: "",
    passwordconfirm: "",
  });

  const [agree, setAgree] = useState("");
  const [emailerr, setEmailerr] = useState(true);
  const [pwerr, setPwerr] = useState(true);
  const [checkpwerr, setCheckpwerr] = useState(true);
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    if (
      !info.email ||
      !info.full_name ||
      !info.password ||
      !info.passwordconfirm
    ) {
      alert("모든 칸에 입력해주세요.");
      return;
    }

    if (info.password !== info.passwordconfirm) {
      alert("비밀번호를 확인해주세요 !");
      return;
    }

    if (agree !== "true") {
      alert("개인정보 수집에 동의해야 합니다.");
      return;
    }

    try {
      await api.post("/auth/register", {
        email: info.email,
        full_name: info.full_name,
        password: info.password,
      });
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.error === "Bad Request") {
        console.log("비번짧");
        alert("더욱 강력한 비밀번호로 설정해주세요 !");
      } else if (err.response?.data?.errorCode === "DUPLICATED_EMAIL") {
        alert("이미 가입된 이메일입니다.");
      } else {
        console.log("네트워크 에러 또는 기타 문제:", err);
        alert(` ${err.response.data.message || "회원가입 실패"}`);
      }
    }
  };

  useEffect(() => {
    const Emailhandler = setTimeout(() => {
      if (!info.email) {
        setEmailerr(true);
        return;
      }

      const checkEmail = async () => {
        try {
          await api.get("users/check-email", {
            params: { email: info.email },
          });
          setEmailerr(true);
        } catch (err) {
          if (err.response.status === 409) {
            setEmailerr(false);
          } else {
            setEmailerr(true);
          }
        }
      };

      checkEmail();
    }, 500);
    return () => {
      clearTimeout(Emailhandler);
    };
  }, [info.email]);

  useEffect(() => {
    const PWhandler = setTimeout(() => {
      if (!info.password) {
        setPwerr(true);
        return;
      }

      if (info.password.length < 10) {
        setPwerr(false);
      } else {
        setPwerr(true);
      }
    }, 500);
    return () => {
      clearTimeout(PWhandler);
    };
  }, [info.password]);

  useEffect(() => {
    const CheckPWhandler = setTimeout(() => {
      if (!info.passwordconfirm) {
        setCheckpwerr(true);
        return;
      }

      if (info.password !== info.passwordconfirm) {
        setCheckpwerr(false);
      } else {
        setCheckpwerr(true);
      }
    }, 500);
    return () => {
      clearTimeout(CheckPWhandler);
    };
  }, [info.password, info.passwordconfirm]);

  return (
    <div className={style.container}>
      <p className={style.joinwrite}>회원가입</p>
      <div>
        <div className={style.joinContainer}>
          <div>
            <input
              className={style.joincon}
              type="email"
              id="email"
              name="emailbox"
              placeholder="e-mail"
              value={info.email}
              onChange={(e) => {
                setInfo({
                  ...info,
                  email: e.target.value,
                });
              }}
            ></input>
            {emailerr === false ? (
              <p className={style.warning}>* 이미 사용중인 이메일입니다.</p>
            ) : (
              ""
            )}
          </div>
          <br></br>
          <div>
            <input
              className={style.joincon}
              type="text"
              id="name"
              name="namebox"
              placeholder="name"
              value={info.full_name}
              onChange={(e) => {
                setInfo({
                  ...info,
                  full_name: e.target.value,
                });
              }}
            ></input>
          </div>
          <br></br>
          <div>
            <input
              className={style.joincon}
              type="password"
              id="pw"
              name="pwbox"
              placeholder="비밀번호"
              value={info.password}
              onChange={(e) => {
                setInfo({
                  ...info,
                  password: e.target.value,
                });
              }}
            ></input>
            {pwerr === false ? (
              <p className={style.warning}>
                * 비밀번호가 짧습니다. 10자 이상 작성해주세요.
              </p>
            ) : (
              ""
            )}
          </div>
          <br></br>
          <div>
            <input
              className={style.joincon}
              type="password"
              id="pwconfirm"
              name="pwbox"
              placeholder="비밀번호 확인"
              value={info.passwordconfirm}
              onChange={(e) => {
                setInfo({
                  ...info,
                  passwordconfirm: e.target.value,
                });
              }}
            ></input>
            {checkpwerr === false ? (
              <p className={style.warning}>* 비밀번호가 동일하지않습니다.</p>
            ) : (
              ""
            )}
          </div>
          <br></br>
        </div>
        <div className={style.agreement}>
          <div className={style.agreementHeader}>
            <div className={style.agreementTitle}>
              <label htmlFor="privacy">개인정보 수집 동의</label>
            </div>
            <div className={style.agreementButtons}>
              <label className={style.agreeButton}>
                <input
                  type="checkbox"
                  checked={agree === "true"}
                  onChange={() => setAgree("true")}
                />
                동의합니다
              </label>
              <label className={style.disagreeButton}>
                <input
                  type="checkbox"
                  checked={agree === "false"}
                  onChange={() => {
                    setAgree("false");
                    alert("동의하지 않을 시 회원가입이 불가합니다.");
                  }}
                />
                동의하지 않습니다
              </label>
            </div>
          </div>
          <div className={style.agreementContent}></div>
        </div>
        <br></br>
        <button className={style.agreebox} onClick={handleJoin}>
          회원가입
        </button>
      </div>
    </div>
  );
}
