import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Upload } from "antd";

const CsvModal = ({ isCsvModalOpen, handleCancel, handleUpload }) => {
  return (
    <Modal
      okText={"ok"}
      onCancel={handleCancel}
      open={isCsvModalOpen}
      title="Import Csv File"
      footer={false}
    >
      <Upload
        beforeUpload={(file) => {
          handleUpload(file);
          return false; // Return false to stop auto-uploading
        }}
      >
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
        <div>Here we have Sample Csv File to Import</div>
      </Upload>
    </Modal>
  );
};

export default CsvModal;
