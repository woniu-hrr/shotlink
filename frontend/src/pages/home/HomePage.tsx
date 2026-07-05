import { useEffect, useState } from 'react'
import { Typography, Card, Row, Col, Button, Spin } from 'antd'
import { SearchOutlined, CameraOutlined, TeamOutlined, PictureOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { portfolioApi } from '../../api/portfolioApi'
import type { Portfolio } from '../../api/portfolioApi'

const { Title, Paragraph } = Typography

const HomePage = () => {
  const navigate = useNavigate()
  const [popularWorks, setPopularWorks] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    portfolioApi.getPopular().then((res) => {
      setPopularWorks(res.data.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const features = [
    {
      icon: <CameraOutlined style={{ fontSize: 48, color: '#1677ff' }} />,
      title: '发现优秀摄影师',
      description: '按地区、风格、价格筛选最适合你的摄影师',
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
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <Title level={1} style={{ fontSize: 48, marginBottom: 16 }}>
          ShotLink 摄链
        </Title>
        <Paragraph style={{ fontSize: 20, color: '#666', maxWidth: 600, margin: '0 auto 32px' }}>
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

      {/* Features */}
      <Row gutter={[24, 24]} style={{ marginBottom: 64 }}>
        {features.map((f, i) => (
          <Col xs={24} sm={8} key={i}>
            <Card hoverable style={{ textAlign: 'center', height: '100%' }}
              bodyStyle={{ padding: '32px 24px' }}>
              <div style={{ marginBottom: 16 }}>{f.icon}</div>
              <Title level={3}>{f.title}</Title>
              <Paragraph style={{ color: '#666' }}>{f.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Popular Works */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>🔥 精选作品</Title>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]}>
          {popularWorks.map((p) => (
            <Col xs={12} sm={8} md={6} key={p.id}>
              <Card
                hoverable
                onClick={() => navigate(`/portfolios/${p.id}`)}
                cover={
                  p.coverUrl ? (
                    <div style={{ height: 200, background: `url(${p.coverUrl}) center/cover` }} />
                  ) : (
                    <div style={{
                      height: 200, background: '#f0f0f0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <PictureOutlined style={{ fontSize: 48, color: '#ccc' }} />
                    </div>
                  )
                }
              >
                <Card.Meta
                  title={p.title}
                  description={`${p.viewCount} 次浏览 · ${p.imageCount} 张图`}
                />
              </Card>
            </Col>
          ))}
          {popularWorks.length === 0 && (
            <Col span={24}>
              <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                还没有作品，<Button type="link" onClick={() => navigate('/register')}>成为第一个摄影师</Button>
              </div>
            </Col>
          )}
        </Row>
      )}
    </div>
  )
}

export default HomePage
