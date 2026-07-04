import { Typography, Card, Row, Col, Button } from 'antd'
import { SearchOutlined, CameraOutlined, TeamOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

const HomePage = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <CameraOutlined style={{ fontSize: 48, color: '#1677ff' }} />,
      title: '发现优秀摄影师',
      description: '浏览摄影师作品集，按地区、风格、价格筛选最适合你的摄影师',
    },
    {
      icon: <SearchOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
      title: '轻松预约拍摄',
      description: '在线查看档期、发起预约，从沟通到交付一站式完成',
    },
    {
      icon: <TeamOutlined style={{ fontSize: 48, color: '#fa8c16' }} />,
      title: '摄影社区交流',
      description: '与摄影爱好者分享作品、技巧，参与话题讨论',
    },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <Title level={1} style={{ fontSize: 48, marginBottom: 16 }}>
          ShotLink 摄链
        </Title>
        <Paragraph
          style={{ fontSize: 20, color: '#666', maxWidth: 600, margin: '0 auto 32px' }}
        >
          连接摄影师与美好瞬间 — 发现、预约、交付，一站式摄影服务平台
        </Paragraph>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Button type="primary" size="large" onClick={() => navigate('/photographers')}>
            浏览摄影师
          </Button>
          <Button size="large" onClick={() => navigate('/register')}>
            成为摄影师
          </Button>
        </div>
      </div>

      {/* Feature Cards */}
      <Row gutter={[24, 24]}>
        {features.map((feature, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              bodyStyle={{ padding: '32px 24px' }}
            >
              <div style={{ marginBottom: 16 }}>{feature.icon}</div>
              <Title level={3}>{feature.title}</Title>
              <Paragraph style={{ color: '#666' }}>{feature.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default HomePage
