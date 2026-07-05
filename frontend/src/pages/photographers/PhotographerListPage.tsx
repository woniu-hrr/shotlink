import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Typography, Tag, Select, Slider, Radio, Spin, Empty, Rate, Input } from 'antd'
import {
  EnvironmentOutlined, SearchOutlined, StarOutlined, ShoppingOutlined,
} from '@ant-design/icons'
import { photographerApi } from '../../api/photographerApi'
import type { PhotographerProfile } from '../../api/photographerApi'

const { Title, Paragraph, Text } = Typography

const PROVINCES = ['Beijing', 'Shanghai', 'Guangdong', 'Zhejiang', 'Jiangsu', 'Sichuan', 'Hubei']
const STYLE_OPTIONS = [
  { label: '婚纱', value: 'WEDDING' },
  { label: '写真', value: 'PORTRAIT' },
  { label: '风光', value: 'LANDSCAPE' },
  { label: '商业', value: 'COMMERCIAL' },
  { label: '街拍', value: 'STREET' },
]
const SORT_OPTIONS = [
  { label: '默认排序', value: 'default' },
  { label: '评分最高', value: 'rating' },
  { label: '接单最多', value: 'bookings' },
]

const PhotographerListPage = () => {
  const navigate = useNavigate()
  const [photographers, setPhotographers] = useState<PhotographerProfile[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [province, setProvince] = useState<string>()
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000])
  const [sortBy, setSortBy] = useState('default')

  const fetchData = () => {
    setLoading(true)
    photographerApi.search({
      province,
      styles: selectedStyles.join(',') || undefined,
      priceMin: priceRange[0] > 0 ? priceRange[0] : undefined,
      priceMax: priceRange[1] < 20000 ? priceRange[1] : undefined,
      sortBy: sortBy === 'default' ? undefined : sortBy,
      page: 0,
      size: 12,
    }).then((res: any) => {
      setPhotographers(res.data.data?.content || [])
      setLoading(false)
    })
  }

  useEffect(() => { fetchData() }, [province, selectedStyles, priceRange, sortBy])

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        🔍 发现摄影师
      </Title>

      {/* Filter Panel */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6}>
            <Text strong><EnvironmentOutlined /> 地区</Text>
            <Select
              allowClear
              placeholder="选择省份"
              style={{ width: '100%', marginTop: 4 }}
              value={province}
              onChange={setProvince}
              options={PROVINCES.map((p) => ({ label: p, value: p }))}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Text strong>📷 拍摄风格</Text>
            <Select
              allowClear
              mode="multiple"
              placeholder="选择风格"
              style={{ width: '100%', marginTop: 4 }}
              value={selectedStyles}
              onChange={setSelectedStyles}
              options={STYLE_OPTIONS}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Text strong>💰 价格区间</Text>
            <Slider
              range
              min={0}
              max={20000}
              step={1000}
              value={priceRange}
              onChange={(v) => setPriceRange(v as [number, number])}
              tooltip={{ formatter: (v) => `¥${v}` }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              ¥{priceRange[0]} - ¥{priceRange[1]}
            </Text>
          </Col>
          <Col xs={24} sm={4}>
            <Text strong>排序</Text>
            <Select
              style={{ width: '100%', marginTop: 4 }}
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
            />
          </Col>
        </Row>
      </Card>

      {/* Results */}
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '60px auto' }} />
      ) : photographers.length === 0 ? (
        <Empty description="没有找到匹配的摄影师" />
      ) : (
        <Row gutter={[16, 16]}>
          {photographers.map((p) => (
            <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
              <Card
                hoverable
                onClick={() => navigate(`/photographers/${p.id}`)}
                cover={
                  <div style={{
                    height: 180,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 48,
                  }}>
                    📸
                  </div>
                }
              >
                <Card.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{p.user?.displayName}</span>
                      <Rate disabled value={Math.round(p.ratingAvg || 0)} count={5} style={{ fontSize: 12 }} />
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        {p.styles?.slice(0, 3).map((s) => (
                          <Tag key={s} color="blue">{s}</Tag>
                        ))}
                      </div>
                      <div style={{ color: '#999', fontSize: 12 }}>
                        <EnvironmentOutlined /> {p.user?.city || p.user?.province || '未知'}
                        &nbsp;·&nbsp;
                        <ShoppingOutlined /> {p.bookingCount} 单
                      </div>
                      <div style={{ color: '#1677ff', fontWeight: 600, marginTop: 4 }}>
                        ¥{p.priceRangeMin} - ¥{p.priceRangeMax}
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

export default PhotographerListPage
