import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { gantt, GanttStatic } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { uniqBy, debounce } from "lodash";
import { TGanttData, TResponse } from "../pages/home";
import { Divider, Select } from "antd";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import moment from "moment";
import { useAppSelector } from "../store/index.ts";
import { selectHome } from "../store/slices/home.ts";
import { getEarliestAndLatestTime } from "../helper.ts";

type Props = {
  data: TResponse[];
  title: string;
};
type GanttRef = RefObject<GanttStatic | HTMLDivElement>;

const GanttChart = ({ data, title }: Props) => {
  const { searchParams } = useAppSelector(selectHome);
  const handlePopState = (event: PopStateEvent) => {
    event.preventDefault();
  };

  const generateGantt = (ganttData: TGanttData[]) => {
    const config = {
      // xml_date: "%Y-%m-%d %H:%i",
      date_format: "%Y-%m-%d %H:%i",
      autosize: true,
      columns: [
        {
          name: "planeName",
          label: "Flight Name",
        },
      ],
      drag_move: false,
      // drag_progress: false,
      drag_resize: false,
      readonly: true,
      // root_id: "root",
      grid_width: 100,
      scales: [
        { unit: "day", format: "%Y-%m-%d" },
        { unit: "hour", step: 3, date: "%H:%i" },
      ],
    };
    gantt.plugins({
      tooltip: true, //开启鼠标悬停提示
    });
    Object.keys(config).forEach((item) => {
      gantt.config[item] = config[item];
    });
    gantt.templates.tooltip_text = (start, end, task) => {
      return task.text;
    };
    gantt.templates.roo;
    gantt.config.open_split_tasks = true;
    gantt.templates.task_text = (start, end, task) => {
      return task.text;
    };
    gantt.init("gantt_here");
    gantt.parse({
      data: ganttData,
      // links:[
      //   { id: 1, source: 1, target: 2, type: '0' },
      //   { id: 2, source: 2, target: 3, type: '0' }
      // ]
    });
  };

  // const mockData = (item: TResponse) => {};

  const generateData = (importData: TResponse[]) => {
    return importData.map((key) => {
      const {
        _id,
        planeId,
        flightId,
        origin,
        destination,
        departureTime,
        arrivalTime,
      } = key;
      let text = destination;
      if (origin) {
        text = `${origin} -` + text;
      }
      const params = {
        id: _id,
        // planeName: planeId,
        parent: `parent_${flightId}`,
        text,
        start_date: new Date(departureTime),
        end_date: new Date(arrivalTime),
      };
      return params;
    });
  };

  const renderfunc = () => {
    if (data) {
      const tempMap = {};
      const gantteData: TGanttData[] = [];
      data.forEach((item) => {
        if (!tempMap[item.planeId]) {
          tempMap[item.planeId] = [];
        }
        tempMap[item.planeId].push(item);
      });
      Object.keys(tempMap).forEach((item) => {
        const tempList: TResponse[] = data.filter(
          (key) => key.planeId === item
        );
        console.log("tempList", tempList);

        if (tempList.length > 1) {
          const { planeId, flightId } = tempList[0];
          const parent: TGanttData = {
            id: `parent_${flightId}`,
            planeName: planeId,
            render: "split",
            text: planeId,
            type: "project",
            color: "#F56C6C",
            open: true,
          };
          gantteData.push(parent);
          const tempGenerateData = generateData(tempList);
          gantteData.push(...tempGenerateData);
        } else {
          let text = tempList[0].destination;
          if (tempList[0].origin) {
            text = `${tempList[0].origin} -` + text;
          }
          const parent: TGanttData = {
            id: tempList[0].flightId,
            planeName: tempList[0].planeId,
            start_date: new Date(tempList[0].departureTime),
            end_date: new Date(tempList[0].arrivalTime),
            render: "split",
            color: "#537CFA",
            type: "project",
            text,
          };
          gantteData.push(parent);
        }
        console.log("gantteData", gantteData);
      });
      generateGantt(gantteData);
    }
  };

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    if (data) {
      renderfunc();
    }
    return () => {
      gantt.clearAll();
      gantt.destructor;
      window.removeEventListener("popstate", handlePopState);
    };
  }, [data]);

  const renderGantte = () => {
    if (data?.length) {
      const ganttData: any = uniqBy(data, "planeId");
      const { earliestTime, latestTime } = getEarliestAndLatestTime(
        data,
        "departureTime",
        "arrivalTime",
        "YYYY-MM-DD"
      );
      return (
        <>
          {/* {<div>{moment(item).format("DD MMM YYYY")}</div>} */}
          <Divider>
            {title} for{" "}
            {ganttData.map((item, index) => {
              return `${item.planeId}${
                index !== ganttData.length - 1 ? "," : ""
              }`;
            })}{" "}
            {`from ${earliestTime} to ${latestTime}`}
          </Divider>
          <div id="gantt_here" style={{ width: "95%" }}></div>
        </>
      );
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      {/* <Select mode="multiple" style={{ width: "200px" }}/> */}
      {renderGantte()}
    </div>
  );
};

export default GanttChart;
