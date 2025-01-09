import React, { useEffect, useMemo, useRef, useState } from "react";
import QueryForm from "../../components/queryForm.tsx";
import GanttChart from "../../components/GanttChart.tsx";
import { set, debounce } from "lodash";
import moment from "moment";
import api from "../../api/index.ts";
import { Alert, Divider, Spin, notification } from "antd";
import {
  selectHome,
  TSearchParams,
  setStateParams,
} from "../../store/slices/home.ts";
import { useAppDispatch, useAppSelector } from "../../store/index.ts";
import dayjs from "dayjs";
import { current } from "@reduxjs/toolkit";

export type TGanttData = {
  id: string;
  planeName?: string;
  text?: string;
  start_date?: Date;
  end_date?: Date;
  color?: string;
  open?: boolean;
  type?: string | null;
  render?: string | null;
  parent?: string | null;
};

export type TResponse = {
  _id: string;
  planeId: string;
  origin: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;
  flightId: string;
};

export type TGanttObject = {
  [key: string]: TGanttData[];
};

export const typeList = [
  { label: "Trips", value: "Trips" },
  { label: "Ground Time", value: "Ground" },
];

export default function index() {
  const dispatch = useAppDispatch();
  const { searchParams } = useAppSelector(selectHome);
  const [tempSearchParams, setTempSearchParams] = useState<TSearchParams>();

  const [loading, setLoading] = useState<boolean>(false);

  const [ganttData, setGanttData] = useState<TResponse[]>([]);

  const [flightList, setFlightList] = useState([]);

  let dateRange: (dayjs.Dayjs | null)[] = [null, null];

  const onCalendarChange = (dates) => {
    if (dates && dates.length > 0) {
      let [startDate, endDate] = dates;
      if (startDate && endDate) {
        const diffInDays = endDate.diff(startDate, "day");
        if (diffInDays > 7) {
          if (startDate.isBefore(endDate)) {
            endDate = startDate.add(7, "day");
          } else {
            startDate = endDate.add(7, "day");
          }
        }
        dateRange = [startDate, endDate];
      } else if (startDate) {
        dateRange = [startDate, startDate.add(7, "day")];
      } else if (endDate) {
        dateRange = [endDate.subtract(7, "day"), endDate];
      } else {
        dateRange = [null, null];
      }
    } else {
      dateRange = [null, null];
    }
  };

  const disabledDate = (current) => {
    if (dateRange[0] && dateRange[1]) {
      const [startDate, endDate] = dateRange;
      if (startDate.isBefore(endDate)) {
        return (
          current.isBefore(startDate) ||
          current.isAfter(endDate) ||
          current.diff(startDate, "day") > 6
        );
      } else {
        return (
          current.isBefore(endDate) ||
          current.isAfter(startDate) ||
          current.diff(endDate, "day") > 6
        );
      }
    }
    return false;
  };

  const field = useMemo(() => {
    return [
      {
        type: "select",
        value: "type",
        comProps: {
          style: { width: "200px" },
          options: typeList,
          placeholder: "Gantte Type",
        },
      },
      {
        type: "select",
        value: "planeId",
        comProps: {
          mode: "multiple",
          style: { width: "200px" },
          options: flightList,
          placeholder: "Flight ID",
          maxTagCount: "responsive",
        },
      },
      {
        type: "dateickerRange",
        value: "selectedTime",
        comProps: {
          disabledDate: (current) => disabledDate(current),
          onCalendarChange: (timeRange) => onCalendarChange(timeRange),
          showTime: { format: "YYYY-MM-DD HH:mm" },
          placeholder: "Time Range",
          format: "YYYY-MM-DD HH:mm",
        },
      },
    ];
  }, [flightList]);

  const calculateEndTime = (startTime, seconds) => {
    let startMoment = moment(startTime);
    let endMoment = startMoment.add(seconds, "seconds");
    let endTime = endMoment.toDate().toISOString();
    return endTime;
  };

  const onSubmit = async (value: any) => {
    setLoading(true);
    try {
      const params = {
        planeId: value.planeId,
        startTime: value.selectedTime[0],
        endTime: value.selectedTime[1],
        type: value.type,
      };
      dispatch(setStateParams({ key: "searchParams", value }));
      const res: any = await api.get("/schedule/getFlight", { params: params });
      if (res?.data) {
        let list = res?.data;
        if (value.type === "Ground") {
          list.forEach((item) => {
            item.departureTime = item.arrivalTime;
            item.arrivalTime = calculateEndTime(
              item.departureTime,
              item.duration
            );
            item.planeId = item.flightInfo.planeId;
            item.flightId = item.flightInfo._id;
            console.log("item", item);
          });
        }
        console.log("list", list);

        setGanttData(list);
      }
    } catch (error) {
      notification.error({
        message: "Fail to get gantte",
        // description:
        //   'Fail to get gantte',
      });
    }
    setLoading(false);
  };

  const validate = (values: any) => {
    const error: any = {};
    const { selectedTime } = values;

    if (!selectedTime || !selectedTime[0] || !selectedTime[1]) {
      error.selectedTime = "Time Range is required!";
    }
    return error;
  };

  const getFlightList = async () => {
    try {
      const res: any = await api.get("/flight/getFlight");
      if (res?.data) {
        setFlightList(
          res.data.map((item) => {
            return {
              value: item._id,
              label: item.planeId,
            };
          })
        );
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const debouncedFetchFlightList = debounce(getFlightList, 300);

  useEffect(() => {
    const temp: TSearchParams = {
      planeId: searchParams.planeId,
      selectedTime: [],
      type: searchParams.type,
    };
    if (
      searchParams?.selectedTime &&
      searchParams.selectedTime[0] &&
      searchParams.selectedTime[1]
    ) {
      temp.selectedTime = [
        // new Date(searchParams.selectedTime[0]),
        dayjs(searchParams.selectedTime[0]),
        dayjs(searchParams.selectedTime[1]),
        // new Date(searchParams.selectedTime[1]),
      ];
    }
    setTempSearchParams(temp);
  }, [searchParams]);

  useEffect(() => {
    debouncedFetchFlightList();
  }, []);

  const title = useMemo(() => {
    if (searchParams.type) {
      return typeList.find((item) => item.value === searchParams.type)?.label;
    }
  }, [searchParams]);

  return (
    <>
      {loading && <Spin spinning={loading} tip="Loading..." fullscreen></Spin>}

      <QueryForm
        searchParams={tempSearchParams}
        field={field}
        validate={validate}
        onSubmit={onSubmit}
      />

      {/* <Divider /> */}
      {!!ganttData?.length && (
        <GanttChart title={title || ""} data={ganttData} />
      )}
    </>
  );
}
