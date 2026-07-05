import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Tag, Spin, Button, Space, Image, Row, Col } from 'antd'
import { ArrowLeftOutlined, EyeOutlined, PictureOutlined } from '@ant-design/icons'
import { portfolioApi } from '../../api/portfolioApi'
import type { Portfolio } from '../../api/portfolioApi'

const { Title, Paragraph } = Typography

const SHOOT_TYPES: Record<string, string> = {
  WEDDING: '婚纱', PORTRAIT: '写真', LANDSCAPE: '风光',
  COMMERCIAL: '商业', STREET: '街拍', OTHER: '其他',
}

const PortfolioDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    portfolioApi.getDetail(Number(id)).then((res) => {
      setPortfolio(res.data.data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />
  if (!portfolio) return <div>作品不存在</div>

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        返回
      </Button>

      <Title level={2}>{portfolio.title}</Title>

      <Space style={{ marginBottom: 16 }}>
        {portfolio.shootType && (
          <Tag color="blue">{SHOOT_TYPES[portfolio.shootType] || portfolio.shootType}</Tag>
        )}
        {portfolio.tags?.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </Space>

      <Paragraph style={{ color: '#666', marginBottom: 16 }}>
        <EyeOutlined /> {portfolio.viewCount} 次浏览 · {portfolio.imageCount} 张图片
      </Paragraph>

      {portfolio.description && (
        <Paragraph style={{ marginBottom: 24 }}>{portfolio.description}</Paragraph>
      )}

      {/* Image Gallery */}
      {portfolio.images && portfolio.images.length > 0 ? (
        <Image.PreviewGroup>
          <Row gutter={[8, 8]}>
            {portfolio.images.map((img) => (
              <Col xs={12} sm={8} md={6} key={img.id}>
                <Image
                  src={img.imageUrl}
                  alt={img.fileName || ''}
                  style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                />
              </Col>
            ))}
          </Row>
        </Image.PreviewGroup>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: 60,
            background: '#fafafa',
            borderRadius: 8,
          }}
        >
          <PictureOutlined style={{ fontSize: 48, color: '#ccc' }} />
          <p style={{ color: '#999', marginTop: 16 }}>暂无作品图片</p>
        </div>
      )}
    </div>
  )
}

export default PortfolioDetailPage
