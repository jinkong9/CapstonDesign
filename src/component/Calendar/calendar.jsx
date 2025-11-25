import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "dayjs/locale/ko";
import styles from "./calendar.module.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../CreatContextAPI/api";

dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.locale("ko");

export default function Mycalendar() {
  const [viewDate, setViewDate] = useState(dayjs());
  const [selectDate, setSelectDate] = useState(dayjs());
  const [Mark, setMark] = useState([]);

  const weekDays = useMemo(
    () => ["일", "월", "화", "수", "목", "금", "토"],
    []
  );

  const startWeek = viewDate.startOf("month").week();
  const endWeek =
    viewDate.endOf("month").week() === 1 ? 53 : viewDate.endOf("month").week();

  const changeMonth = (change) => {
    switch (change) {
      case "add":
        setViewDate(viewDate.add(1, "month"));
        break;
      case "subtract":
        setViewDate(viewDate.subtract(1, "month"));
        break;
      case "today":
        setViewDate(dayjs());
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const MarkDairy = async () => {
      try {
        const year = viewDate.year();
        const month = viewDate.month() + 1;

        const res = await api.get("/me/calendar", {
          params: { year, month },
        });
        console.log("good", res.data);
        setMark(res.data.calendar || []);
      } catch (err) {
        console.log("실패", err.response?.data || err);
      }
    };
    MarkDairy();
  }, [viewDate]);

  return (
    <div className={styles.wrraper}>
      <div className={styles.container}>
        <p className={styles.headerText}>나의 캘린더 📅</p>
        <p className={styles.headerText2}>
          일기를 쓴 날에는 "O" 표시가 됩니다.
        </p>

        <header className={styles.header}>
          <button
            className={styles.montnBtn}
            onClick={() => changeMonth("subtract")}
          >
            {"<"}
          </button>
          <span
            onClick={() => changeMonth("today")}
            className={styles.monthLabel}
          >
            {viewDate.format("YYYY년 M월")}
          </span>
          <button
            className={styles.montnBtn}
            onClick={() => changeMonth("add")}
          >
            {">"}
          </button>
        </header>

        <div className={styles.weekDays}>
          {weekDays.map((day, i) => (
            <div
              key={i}
              className={`${styles.weekDay} ${i === 0 ? styles.sunday : ""} ${i === 6 ? styles.saturday : ""}`}
            >
              {day}
            </div>
          ))}
        </div>
        <div className={styles.daysGrid}>
          {Array.from(
            { length: endWeek - startWeek + 1 },
            (_, index) => startWeek + index
          ).map((week) =>
            Array(7)
              .fill(0)
              .map((_, i) => {
                const current = viewDate
                  .week(week)
                  .startOf("week")
                  .add(i, "day");
                const Today = dayjs().isSame(current, "day");
                const Click = selectDate.isSame(current, "day");
                const Other = current.month() !== viewDate.month();

                const index = current.date() - 1;
                const Marked =
                  current.month() === viewDate.month() && Mark[index] === true;

                return (
                  <div
                    key={`${week}_${i}`}
                    className={`${styles.dayBox} ${Today ? styles.today : ""} ${Click ? styles.selected : ""} ${Other ? styles.otherMonth : ""}`}
                    onClick={() => setSelectDate(current)}
                  >
                    {current.date()}
                    {Marked && (
                      <span className={styles.check}>
                        {" "}
                        <Link
                          to="/user-info"
                          style={{
                            textDecoration: "none",
                          }}
                        >
                          {" "}
                          O{" "}
                        </Link>
                      </span>
                    )}
                  </div>
                );
              })
          )}
        </div>
      </div>
      <p className={styles.extratext}>"O"클릭 시 내정보로 이동합니다.</p>
    </div>
  );
}
