import React, { useEffect, useState } from "react";
import { Select, Pagination, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { ColumnProps } from "antd/es/table";

export type TTableCustomConfig = {
  pageNo: number;
  pageSize: number;
};

export type Config = {
  dropDownOption?: any[];
  totalCount: number;
  header: string;
  onDropDownChange: (e) => void;
};

const Header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

const DisplayRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};

export default function commonDataTable({
  tableField,
  config,
  tableProps,
}: {
  tableField: any[];
  config: Config & TTableCustomConfig;
  tableProps: TableProps;
}) {
  console.log("tableProps", tableProps);

  const { totalCount, header, pageNo, pageSize, onDropDownChange } = config;
  const [field, setField] = useState<ColumnProps[]>([]);
  const pageDropDown = config.dropDownOption || [10, 25, 50];
  const pageDropDownMap = pageDropDown.map((item) => ({
    value: item,
    label: item,
  }));

  useEffect(() => {
    setField(
      tableField.map((item) => ({
        ...item,
        dataIndex: item.key,
      }))
    );
  }, [tableField]);

  return (
    <>
      <div style={Header}>
        <div>
          No. of {header}:{totalCount}
        </div>
        <div style={DisplayRow}>
          <span>Showing</span>
          <Select
            style={{ width: "94px", margin: "0 4px" }}
            options={pageDropDownMap}
            onChange={onDropDownChange}
            value={pageSize}
          />
          <span>records</span>
        </div>
      </div>

      <Table {...tableProps} columns={field} />
      {/* <Pagination defaultCurrent={1} total={totalCount || 0} /> */}
    </>
  );
}
