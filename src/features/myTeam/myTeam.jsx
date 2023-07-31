import {
  Col,
  Row,
  Typography,
  Card,
  Button,
  Avatar,
  Divider,
  List,
} from "antd";
import { PlusOutlined, CaretUpOutlined, MoreOutlined } from "@ant-design/icons";
import ProfileAvatar from "../../assets/images/profile.svg";
const { Title, Paragraph } = Typography;
export default function MyTeam() {
  const data = [
    {
      title: "Staus",
      detail: "Full time",
    },
    {
      title: "Shift",
      detail: "Morning",
    },
    {
      title: "Email",
      detail: "karim@codedistrict.com",
    },
    {
      title: "Lead",
      detail: "Haseeb",
    },
  ];
  return (
    <div>
      <div className="team-header mb-4">
        <Title level={5} className="mb-0">
          My Team
        </Title>
        <div className="header-text">
          <p className="mb-0">My Team</p>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            className="select-date"
          >
            Team Member
          </Button>
        </div>
      </div>
      <Row gutter={[24, 24]} className="employees-detail-wrap mb-4">
        <Col xs={24} sm={12} lg={6}>
          <Card className="employees-card">
            <div className="employees-detail">
              <p className="mb-0">Total Employees</p>
              <span className="icon-bg org-clr">
                {<i className="icon-total-employees"></i>}
              </span>
            </div>
            <Title level={5} className="detail-numbers">
              1,920
            </Title>
            <div className="time-percentage">
              <p className="up-outlined">10% {<CaretUpOutlined />}</p>
              <p>+$150 today</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="employees-card">
            <div className="employees-detail">
              <p className="mb-0">Avg. Clock in</p>
              <span className="icon-bg green-clr">
                {<i className="icon-clock-in"></i>}
              </span>
            </div>
            <Title level={5} className="detail-numbers">
              1,920
            </Title>
            <div className="time-percentage">
              <p className="up-outlined">10% {<CaretUpOutlined />}</p>
              <p>+$150 today</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="employees-card">
            <div className="employees-detail">
              <p className="mb-0">Avg. Clock out</p>
              <span className="icon-bg red-clr">
                {<i className="icon-clock-in"></i>}
              </span>
            </div>
            <Title level={5} className="detail-numbers">
              1,920
            </Title>
            <div className="time-percentage">
              <p className="up-outlined">10% {<CaretUpOutlined />}</p>
              <p>+$150 today</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="employees-card">
            <div className="employees-detail">
              <p className="mb-0">Avg. Worked Hours</p>
              <span className="icon-bg gray-clr">
                {<i className="icon-avg-hours"></i>}
              </span>
            </div>
            <Title level={5} className="detail-numbers">
              1,920
            </Title>
            <div className="time-percentage">
              <p className="up-outlined">10% {<CaretUpOutlined />}</p>
              <p>+$150 today</p>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="profile-card text-center">
            <MoreOutlined />
            <div className="position-relative profile-upload">
              <Avatar
                className="avatar-img text-center"
                size={80}
                src={ProfileAvatar}
              />
            </div>
            <Title level={4} className="text-center">
              Chris Daniel
            </Title>
            <Paragraph>Designer</Paragraph>
            <Divider />
            <List
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <Title level={5}> {item.title}</Title>
                  <Paragraph>{item.detail}</Paragraph>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="profile-card text-center">
            <MoreOutlined />
            <div className="position-relative profile-upload">
              <Avatar
                className="avatar-img text-center"
                size={80}
                src={ProfileAvatar}
              />
            </div>
            <Title level={4} className="text-center">
              Chris Daniel
            </Title>
            <Paragraph>Designer</Paragraph>
            <Divider />
            <List
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <Title level={5}> {item.title}</Title>
                  <Paragraph>{item.detail}</Paragraph>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="profile-card text-center">
            <MoreOutlined />
            <div className="position-relative profile-upload">
              <Avatar
                className="avatar-img text-center"
                size={80}
                src={ProfileAvatar}
              />
            </div>
            <Title level={4} className="text-center">
              Chris Daniel
            </Title>
            <Paragraph>Designer</Paragraph>
            <Divider />
            <List
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <Title level={5}> {item.title}</Title>
                  <Paragraph>{item.detail}</Paragraph>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="profile-card text-center">
            <MoreOutlined />
            <div className="position-relative profile-upload">
              <Avatar
                className="avatar-img text-center"
                size={80}
                src={ProfileAvatar}
              />
            </div>
            <Title level={4} className="text-center">
              Chris Daniel
            </Title>
            <Paragraph>Designer</Paragraph>
            <Divider />
            <List
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <Title level={5}> {item.title}</Title>
                  <Paragraph>{item.detail}</Paragraph>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
