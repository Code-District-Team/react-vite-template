import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Typography, Upload } from "antd";
import { Scrollbars } from "react-custom-scrollbars-2";
const { Dragger } = Upload;

const csvFilePath = "/productsample.csv";

const CsvModal = ({
  isCsvModalOpen,
  handleCancel,
  handleUpload,
  serverErrors,
  uploadedFile,
  setUploadedFile,
}) => {
  return (
    <Modal
      okText={"ok"}
      onCancel={handleCancel}
      open={isCsvModalOpen}
      title="Import Csv File"
      footer={false}
    >
      <Dragger
        fileList={uploadedFile}
        beforeUpload={(file) => {
          handleUpload(file);
          setUploadedFile([file]);
          return false; // Return false to stop auto-uploading
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Dragger>

      <div className="m-2">
        <p className="ant-upload-text">
          Here we have
          <a href={csvFilePath} download="productsample.csv" className="m-1">
            Sample Csv File
          </a>
          to Import
        </p>
      </div>
      {serverErrors && serverErrors.length > 0 && (
        <>
          <Typography.Title level={5} style={{ color: "red" }}>
            Errors in CSV:
          </Typography.Title>
          <Scrollbars style={{ height: 400 }}>
            <div className="m-2">
              <ul>
                {serverErrors.map((error, index) => (
                  <li key={index} style={{ color: "red" }}>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </Scrollbars>
        </>
      )}
    </Modal>
  );
};

export default CsvModal;
