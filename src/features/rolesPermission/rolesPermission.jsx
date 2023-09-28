import { Button, Form, Input, Modal, Table, Transfer } from "antd";
import Card from "antd/es/card/Card";
import Search from "antd/es/input/Search";
import Paragraph from "antd/es/skeleton/Paragraph";
import Title from "antd/es/skeleton/Title";

export default function RolesPermission() {
  return (
    <>
      <Card
        className="roles-permission-card"
        title={
          <>
            <Search />
          </>
        }
        extra={
          <>
            <div
            // className={LayoutCss.appListingCardRolesTable}
            >
              <Button

              //   className={LayoutCss.appListingCardRolesTableButton}
              >
                <i className={"icon-plus "}></i>
                <span>Add New</span>
              </Button>
            </div>
          </>
        }
      >
        <div
          className="ag-theme-alpine s2-theme-style"
          style={{
            height: 735,
          }}
        >
          <Table />
        </div>
      </Card>
      <Modal
        title={
          <Title className="ant-modal-title">
            <Paragraph className="rolesTableModal">
              Please fill in all the details
            </Paragraph>
          </Title>
        }
      >
        <Form layout="vertical">
          <Form.Item
            label="Role Name"
            name="name"
            rules={[
              { required: true, message: "Please enter role name!" },
              { min: 3, message: "Name must be at least 3 characters" },
              {
                max: 150,
                message: "Name cannot be longer than 150 characters",
              },
            ]}
          >
            <Input placeholder="Enter" className="rolesTableInput" />
          </Form.Item>
        </Form>
        <Title level={5} className="rolesTableTypography">
          Select Permissions
        </Title>
        <Transfer />
      </Modal>
    </>
  );
}
