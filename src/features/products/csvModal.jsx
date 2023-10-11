import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Upload } from "antd";

const CsvModal = ({ isCsvModalOpen, handleCancel }) => {
  return (
    <Modal
      okText={"Ok"}
      onCancel={handleCancel}
      open={isCsvModalOpen}
      title="Import Csv File"
      footer={false}
    >
      <Upload>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
        Here we have Sample Csv File to Import
      </Upload>
    </Modal>
  );
};

export default CsvModal;
