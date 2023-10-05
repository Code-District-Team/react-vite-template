import { Button, Card, Col, Form, Input, Row, Upload } from "antd";
import { useState } from "react";
import User from "~/models/user";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";
import ImgCrop from "antd-img-crop";

const onPreview = async (file) => {
  let src = file.url;
  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => resolve(reader.result);
    });
  }
  const image = new Image();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow?.document.write(image.outerHTML);
};

export default function ProfilePage() {
  const [form] = Form.useForm();
  const data = User.getUserObjectFromCookies();
  // const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleUpload = (info) => {
    console.log("handleupload", info);
  };
  const onChange = ({ fileList: newFileList }) => {
    console.log("File list", newFileList);
    setFileList(newFileList);
  };
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
            <ImgCrop rotationSlider>
              <Upload
                maxCount={1}
                multiple={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture-card"
                fileList={fileList}
                customRequest={(info) => {
                  handleUpload(info);
                  console.log("Info....", info);
                  // info.onSuccess((value) => {
                  //   console.log("Info success", value);
                  // });
                }}
                onChange={onChange}
                onPreview={onPreview}
              >
                {fileList.length < 5 && "+ Upload"}
              </Upload>
            </ImgCrop>
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
