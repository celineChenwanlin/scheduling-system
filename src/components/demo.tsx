import React, { useEffect } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

export default function demo() {
  const initGannt = () => {
    const ganttData: any = [
      {
        cStatus: "已完成",
        id: "f1",
        parent: null,
        type: "project",
        render: "split",
      },
      {
        start_date: new Date("2024-12-25"),
        duration: 1,
        cStatus: "在执行",
        id: "c1",
        parent: "f1",
        type: null,
        render: null,
      },
      {
        start_date: new Date("2024-12-26"),
        duration: 1,
        cStatus: "已完成",
        id: "c2",
        parent: "f1",
        type: null,
        render: null,
      },
      {
        cStatus: "已完成",
        id: "f2",
        parent: null,
        type: null,
        render: null,
      },
      {
        start_date: new Date("2024-12-28"),
        duration: 1,
        cStatus: "在执行",
        id: "cc1",
        parent: "f2",
        type: null,
        render: null,
      },
    ];
    // ...这里写甘特图配置

    // 语言设置-中文
    gantt.i18n.setLocale("cn");

    // 设置甘特图表格列的最小列宽
    gantt.config.mcolumn_width = 20;

    // 设置表格列，name为数据字段，label为表头显示的名称，width为列宽，align为对齐方式
    gantt.config.columns = [
      { name: "cCode", label: "学号", width: 80, align: "left" },
      { name: "cName", label: "名称", width: 50, align: "center" },
      { name: "cHeight", label: "身高", width: 30, align: "center" },
    ];

    // 设置右侧时间刻度相关属性，上方显示年月日，下方显示小时，每个格子代表12小时
    gantt.config.scales = [
      { unit: "day", format: "%Y-%m-%d" },
      { unit: "hour", step: 12, format: "%H" },
    ];

    // 设置任务条上展示的内容，参数task会返回当前任务的数据
    gantt.templates.task_text = function (start, end, task) {
      return task.cCode + "-" + task.cName + "-" + task.cHeight;
    };

    // 禁用任务条链接拖动功能
    gantt.config.drag_links = false;
    // 禁用任务条左右边缘拉动功能
    gantt.config.drag_resize = false;
    // 禁用任务条长按移动功能
    gantt.config.drag_move = false;
    // 禁用任务条拖动进度条功能
    gantt.config.drag_progress = false;
    // 设置甘特图滚动条的大小为25px
    gantt.config.scroll_size = 25;
    // 开启表格排序功能
    gantt.config.sort = true;
    // 渲染发生错误时不显示默认的错误弹框
    gantt.config.show_errors = false;
    gantt.parse(ganttData);
    gantt.init("ganttContainer");
  };

  // 修改任务条显示的内容是cStatus属性的值
  gantt.templates.task_text = function (start, end, task) {
    return task.cStatus;
  };

  useEffect(() => {
    initGannt();
  }, []);

  return (
    <div
      id="ganttContainer"
      style={{ width: "1000px", height: " 200px" }}
    ></div>
  );
}
