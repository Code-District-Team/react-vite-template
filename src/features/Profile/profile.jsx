import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Upload,
  message,
} from "antd";
import { useState } from "react";
import User from "~/models/user";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

export default function ProfilePage() {
  const [form] = Form.useForm();
  const data = User.getUserObjectFromCookies();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const onFinish = async (values) => {
    const { email, status, ...rest } = values;
    rest.id = User.getId();
    try {
      await User.updateProfileData(rest);
    } catch (error) {
      setFieldErrorsFromServer(error, form, values);
    }
  };

  return (
    <div className="profile-container">
      <Card title="User Profile">
        <Row>
          <Col span={8}>
            <Space direction="vertical" size={16}>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                      width: "100%",
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Space>
          </Col>
          <Col span={16}>
            <Form
              onFinish={onFinish}
              form={form}
              name="profile-form"
              initialValues={data.user}
              layout="horizontal"
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 16,
              }}
              labelAlign="left"
            >
              <Form.Item name="firstName" label="FirstName">
                <Input size="middle" />
              </Form.Item>
              <Form.Item label="Last Name:" name="lastName">
                <Input size="middle" />
              </Form.Item>
              <Form.Item label="Mobile Phone:" name="mobilePhone">
                <Input size="middle" />
              </Form.Item>
              <Form.Item label="Address:" name="address">
                <Input size="middle" />
              </Form.Item>
              <Form.Item label="Email:" name="email">
                <Input size="middle" disabled />
              </Form.Item>
              <Form.Item label="Status:" name="status">
                <Input size="middle" disabled />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 12,
                  span: 12,
                }}
              >
                <Button type="primary" size="middle" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
