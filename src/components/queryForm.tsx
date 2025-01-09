import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { Button, Flex, TimePicker, Input, DatePicker, Select } from "antd";
// import type { DatePickerProps, GetProps } from 'antd';
const { RangePicker } = DatePicker;
import { SearchOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import { isArray, get } from "lodash";

// type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const Style: React.CSSProperties = {
  // margin: "20px 0 20px 10px",
};

export type TQueryForm = {
  field: {
    type: string;
    value: string;
    comProps?: any;
    handleData?: (value: any) => void;
  }[];
  searchParams?: any;
  onSubmit: (value: any) => void;
  validate?: (value: any) => void;
};

export default function queryForm({
  field,
  searchParams,
  onSubmit,
  validate,
}: TQueryForm) {
  const [queryField, setQueryField] = useState<TQueryForm["field"]>([]);

  const formik = useFormik({
    initialValues: {},
    validateOnBlur: true,
    validateOnChange: false,
    validate: (formData: any) => {
      if (validate) {
        return validate(formData);
      }
    },
    onSubmit: (formData: any) => {
      onSubmit(formData);
    },
  });

  const errors = formik.errors;

  useEffect(() => {
    if (isArray(queryField)) {
      setQueryField(field);
    }
  }, [field, searchParams]);

  useEffect(() => {
    if (searchParams && Object.keys(searchParams)?.length) {
      Object.keys(searchParams).forEach((item) => {
        if (searchParams[item]) {
          formik.setFieldValue(item, searchParams[item]);
        }
      });
    }
  }, [searchParams]);

  const handleChange = (item, value) => {
    if (item.handleData) {
      const temp = item.handleData(item, value);
      formik.setFieldValue(item.value, temp);
    } else {
      formik.setFieldValue(item.value, value);
    }
  };

  const checkError = (item) => {
    return !!errors[item.value] ? "error" : "";
  };

  return (
    <Flex vertical={false} gap="middle" wrap style={Style}>
      {!!queryField.length &&
        queryField.map((item, index) => {
          let nodeItem: any;
          if (item.type === "timePicker") {
            nodeItem = (
              <TimePicker
                onChange={(value) => {
                  // console.log("value", value);
                }}
                value={formik.values[item.value]}
                format="HH:mm"
              />
            );
          }
          if (item.type === "timePickerRange") {
            nodeItem = (
              <TimePicker.RangePicker
                status={checkError(item)}
                onChange={(timeRange) => {
                  if (timeRange && timeRange[0] && timeRange[1]) {
                    const start = timeRange[0].toDate();
                    const end = timeRange[1].toDate();
                    handleChange(item, [start, end]);
                  }
                }}
                // value={formik.values[item.value]}
                format="HH:mm"
              />
            );
          }
          if (item.type === "dateickerRange") {
            nodeItem = (
              <RangePicker
                onChange={(timeRange) => {
                  if (timeRange && timeRange[0] && timeRange[1]) {
                    const start = timeRange[0];
                    const end = timeRange[1];
                    handleChange(item, [start, end]);
                  } else {
                    handleChange(item, []);
                  }
                }}
                {...item.comProps}
                status={checkError(item)}
                value={formik.values[item.value] || []}
              />
            );
          }
          if (item.type === "input") {
            nodeItem = (
              <Input
                status={checkError(item)}
                onChange={(e) => {
                  handleChange(item, e.target.value);
                }}
                // value={formik.values[item.value]}
                placeholder="default size"
              />
            );
          }
          if (item.type === "select") {
            nodeItem = (
              <Select
                status={checkError(item)}
                onChange={(e) => {
                  handleChange(item, e);
                }}
                value={formik.values[item.value]}
                placeholder="default size"
                {...item.comProps}
              />
            );
          }
          return <div key={item.value}>{nodeItem}</div>;
        })}
      <Button
        onClick={() => formik.handleSubmit()}
        htmlType="submit"
        icon={<SearchOutlined />}
        iconPosition="end"
      >
        Search
      </Button>
    </Flex>
  );
}
