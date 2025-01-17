import React from "react";
import {
  Button,
  ColorPicker,
  ConfigProvider,
  Divider,
  Form,
  Input,
  InputNumber,
  Space,
  Switch,
} from "antd";
const defaultData = {
  borderRadius: 6,
  colorPrimary: "#1677ff",
  Button: {
    colorPrimary: "#00B96B",
  },
};
const Theme = () => {
  const [form] = Form.useForm();
  const [data, setData] = React.useState(defaultData);
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: data.colorPrimary,
            borderRadius: data.borderRadius,
          },
          components: {
            Button: {
              colorPrimary: data.Button?.colorPrimary,
              algorithm: data.Button?.algorithm,
            },
          },
        }}
      >
        <Space>
          <Input />
          <Button type="primary">Button</Button>
        </Space>
      </ConfigProvider>
      <Divider />
      <Form
        form={form}
        onValuesChange={(_, allValues) => {
          setData({
            ...allValues,
          });
        }}
        name="theme"
        initialValues={defaultData}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 20,
        }}
      >
        <Form.Item
          name="colorPrimary"
          label="Primary Color"
          trigger="onChangeComplete"
          getValueFromEvent={(color) => color.toHexString()}
        >
          <ColorPicker />
        </Form.Item>
        <Form.Item name="borderRadius" label="Border Radius">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Button">
          <Form.Item
            name={["Button", "algorithm"]}
            valuePropName="checked"
            label="algorithm"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name={["Button", "colorPrimary"]}
            label="Primary Color"
            trigger="onChangeComplete"
            getValueFromEvent={(color) => color.toHexString()}
          >
            <ColorPicker />
          </Form.Item>
        </Form.Item>
        <Form.Item
          name="submit"
          wrapperCol={{
            offset: 4,
            span: 20,
          }}
        >
          <Button type="primary">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Theme;
