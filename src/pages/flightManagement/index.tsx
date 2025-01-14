import React, { useMemo, useState } from "react";
import CommonDataTable, {
  Config,
  TTableCustomConfig,
} from "../../components/commonDataTable.tsx";
import { ColumnProps } from "antd/es/table";
import QueryForm from "../../components/queryForm.tsx";
import api from "../../api/index.ts";
import { Button, Form, Input, Modal, notification, Spin } from "antd";
import { TSearchParams } from "../../store/slices/home.ts";

const Header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

export default function index() {
  const [dataSource, setDataSource] = useState<any>([]);
  const [tempSearchParams, setTempSearchParams] = useState<TSearchParams>();
  const [modalSearchParams, setModalSearchParams] = useState<TSearchParams>();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [tableCustomConfig, setTableCustomConfig] =
    useState<TTableCustomConfig>({
      pageNo: 1,
      pageSize: 25,
    });

  const field = [
    {
      type: "input",
      value: "planeId",
      comProps: {
        placeholder: "Plane's ID",
      },
    },
  ];

  const tableField: ColumnProps[] = [
    {
      title: "Plane Name",
      key: "planeId",
    },
    {
      title: "Aircraft Type",
      key: "aircraftType",
    },
  ];

  const onDropDownChange = (e) => {
    console.log("e", e);
    setTableCustomConfig((value) => ({
      ...value,
      pageSize: e,
    }));
  };

  const onSubmit = async (e) => {
    setLoading(true);
    try {
      console.log("e", e);
      const res: any = await api.get("/flight/getFlight", { params: e });
      console.log("res", res);
      if (res?.data) {
        setDataSource(res.data);
      }
    } catch (error) {
      notification.error({
        message: "Fail to get data",
        // description:
        //   'Fail to get gantte',
      });
    } finally {
      setLoading(false);
    }
  };

  const tableConfig: Config = useMemo(() => {
    const config = {
      // totalCount = dataSource
      totalCount: dataSource.length,
      header: "Plane",
      onDropDownChange,
    };
    return config;
  }, [dataSource]);

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      {loading && <Spin spinning={loading} tip="Loading..." fullscreen></Spin>}
      <div style={Header}>
        <QueryForm
          searchParams={tempSearchParams}
          field={field}
          onSubmit={onSubmit}
        />
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          Create
        </Button>
      </div>

      <CommonDataTable
        tableField={tableField}
        config={{ ...tableConfig, ...tableCustomConfig }}
        tableProps={{
          dataSource: dataSource,
        }}
      />
      <Modal
        title="Create Flight"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={handleOk}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Plane's ID"
            name="planeId"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
