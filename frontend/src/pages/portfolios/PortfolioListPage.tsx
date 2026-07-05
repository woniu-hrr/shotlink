import { useEffect, useState } from 'react'
import { Card, Row, Col, Typography, Tag, Spin, Empty, Input } from 'antd'
import { EyeOutlined, PictureOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { portfolioApi } from '../../api/portfolioApi'
import type { Portfolio } from '../../api/portfolioApi'

const { Title, Paragraph } = Typography
const { Meta } = Card

const SHOOT_TYPES: Record<string, string> = {
  WEDDING: '婚纱',
  PORTRAIT: '写真',
  LANDSCAPE: '风光',
  COMMERCIAL: '商业',
  STREET: '街拍',
  OTHER: '其他',
}

const PortfolioListPage = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    portfolioApi.list(0, 20).then((res) => {
      setPortfolios(res.data.data?.content || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <Title level={2}>🎨 作品广场</Title>
        <Paragraph type="secondary">发现优秀摄影作品，获取拍摄灵感</Paragraph>
        <Input.Search
          placeholder="搜索作品..."
          style={{ maxWidth: 400, marginTop: 16 }}
          prefix={<SearchOutlined />}
        />
      </div>

      {portfolios.length === 0 ? (
        <Empty description="暂无作品" />
      ) : (
        <Row gutter={[16, 16]}>
          {portfolios.map((p) => (
            <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
              <Card
                hoverable
                onClick={() => navigate(`/portfolios/${p.id}`)}
                cover={
                  p.coverUrl ? (
                    <div
                      style={{
                        height: 220,
                        background: `url(${p.coverUrl}) center/cover`,
                        backgroundSize: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 220,
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PictureOutlined style={{ fontSize: 48, color: '#ccc' }} />
                    </div>
                  )
                }
              >
                <Meta
                  title={p.title}
                  description={
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        {p.tags?.slice(0, 3).map((tag) => (
                          <Tag key={tag} color="blue">{tag}</Tag>
                        ))}
                        {p.shootType && <Tag>{SHOOT_TYPES[p.shootType] || p.shootType}</Tag>}
                      </div>
                      <div style={{ color: '#999', fontSize: 12 }}>
                        <EyeOutlined /> {p.viewCount} &nbsp;
                        {p.imageCount} 张图片
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default PortfolioListPage
