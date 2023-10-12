import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Upload } from "antd";
const csvFilePath = "/productsample.csv";
const CsvModal = ({ isCsvModalOpen, handleCancel, handleUpload }) => {
  return (
    <Modal
      okText={"ok"}
      onCancel={handleCancel}
      open={isCsvModalOpen}
      title="Import Csv File"
      footer={false}
    >
      <div className="m-2">
        <Upload
          beforeUpload={(file) => {
            handleUpload(file);
            return false; // Return false to stop auto-uploading
          }}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </div>
      <div className="m-2">
        Here we have
        <a href={csvFilePath} download="productsample.csv" className="m-1">
          Sample Csv File
        </a>
        to Import
      </div>
    </Modal>
  );
};

export default CsvModal;
