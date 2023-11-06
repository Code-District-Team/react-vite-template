import { Button, Card, Col, Form, Input, Row, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import { useState } from "react";
import image from "~/assets/images/images.jpeg";
import User from "~/models/user";
import K from "~/utilities/constants";
import { setFieldErrorsFromServer } from "~/utilities/generalUtility";

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
  const defaultImageUrl = image;
  const userData = User.getUserObjectFromCookies().user;
  const [fileList, setFileList] = useState([
    {
      url:
        userData?.profileImageUrl != null
          ? `${K.Network.URL.BaseAPI}/${userData.profileImageUrl}`
          : defaultImageUrl,
    },
  ]);
  const handleUpload = async (info) => {
    const formData = new FormData();
    formData.append("file", info?.file);
    try {
      await User.uploadProfilePicture(formData);
    } catch (error) {
      message.error("Failed to Upload file");
    }
  };

  const onRemove = async (file) => {
    try {
      await User.deleteProfilePicture(file);
      setFileList([
        {
          url: defaultImageUrl,
        },
      ]);
      return false;
    } catch (error) {
      message.error("Failed to Upload file");
    }
  };
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async (values) => {
    const { email, status, ...rest } = values;
    rest.id = userData.id;
    try {
      await User.updateProfileData(rest);
    } catch (error) {
      setFieldErrorsFromServer(error, form, values);
    }
  };

  return (
    <div className="profile-container">
      <Card className="card-wrapper" title="User Profile">
        <Row>
          <Col span={8}>
            <ImgCrop rotationSlider>
              <Upload
                maxCount={1}
                multiple={false}
                listType="picture-card"
                fileList={fileList}
                customRequest={(info) => {
                  handleUpload(info);
                  info.onSuccess((value) => {
                    console.log("Info success", value);
                  });
                }}
                onChange={onChange}
                onPreview={onPreview}
                onRemove={onRemove}
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
              initialValues={userData}
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
              <Form.Item label="Last Name" name="lastName">
                <Input size="middle" />
              </Form.Item>
              <Form.Item label="Mobile Phone" name="mobilePhone">
                <Input size="middle" />
              </Form.Item>
              <Form.Item label="Address" name="address">
                <Input size="middle" />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input size="middle" disabled />
              </Form.Item>
              <Form.Item label="Status" name="status">
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
