import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Card, Statistic, Typography, Spin, Tabs, Table, Button, Tag, Space } from 'antd'
import {
  CalendarOutlined, TeamOutlined, DollarOutlined, ClockCircleOutlined,
} from '@ant-design/icons'
import { crmApi } from '../../api/crmApi'
import type { DashboardStats } from '../../api/crmApi'
import { bookingApi } from '../../api/bookingApi'
import type { Booking } from '../../api/bookingApi'
import { useAuthStore } from '../../stores/authStore'
import dayjs from 'dayjs'

const { Title } = Typography

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'gold', label: '待确认' },
  CONFIRMED: { color: 'blue', label: '已确认' },
  SHOOTING: { color: 'purple', label: '拍摄中' },
  DELIVERED: { color: 'green', label: '已交付' },
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const isPhotographer = user?.role === 'PHOTOGRAPHER'

  useEffect(() => {
    Promise.all([
      isPhotographer ? crmApi.getDashboard() : Promise.resolve(null),
      bookingApi.list(isPhotographer ? 'photographer' : 'client'),
    ]).then(([statsRes, bookingRes]) => {
      if (statsRes) setStats((statsRes as any).data.data)
      setBookings((bookingRes as any).data.data?.content || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '60px auto' }} />

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      <Title level={2}>📊 工作台</Title>

      {isPhotographer && stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6}>
            <Card><Statistic title="总预约" value={stats.totalBookings} prefix={<CalendarOutlined />} /></Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card><Statistic title="客户数" value={stats.totalClients} prefix={<TeamOutlined />} /></Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card><Statistic title="待处理" value={stats.pendingBookings} prefix={<ClockCircleOutlined />}
              valueStyle={{ color: stats.pendingBookings > 0 ? '#faad14' : undefined }} /></Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card><Statistic title="总收入" value={stats.totalRevenue} prefix={<DollarOutlined />}
              suffix="元" /></Card>
          </Col>
        </Row>
      )}

      <Tabs defaultActiveKey="bookings" items={[
        {
          key: 'bookings', label: '预约列表',
          children: (
            <Table dataSource={bookings} rowKey="id" size="middle" pagination={{ pageSize: 10 }}
              columns={[
                { title: 'ID', dataIndex: 'id', width: 60 },
                { title: isPhotographer ? '客户' : '摄影师', dataIndex: isPhotographer ? ['client', 'displayName'] : ['photographer', 'displayName'] },
                { title: '日期', dataIndex: 'shootDate', render: (d: string) => dayjs(d).format('MM/DD') },
                { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={STATUS_MAP[s]?.color}>{STATUS_MAP[s]?.label || s}</Tag> },
                { title: '价格', dataIndex: 'price', render: (p: number) => `¥${p || 0}` },
              ]} />
          ),
        },
        ...(isPhotographer ? [
          {
            key: 'crm', label: 'CRM 工具',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Card hoverable onClick={() => navigate('/dashboard/crm/contracts')}>
                    <Title level={4}>📄 合同管理</Title>
                    <p style={{ color: '#666' }}>创建和管理拍摄合同</p>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card hoverable onClick={() => navigate('/dashboard/crm/invoices')}>
                    <Title level={4}>🧾 发票管理</Title>
                    <p style={{ color: '#666' }}>开具和管理发票</p>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card hoverable onClick={() => navigate('/dashboard/crm/deliveries')}>
                    <Title level={4}>📦 照片交付</Title>
                    <p style={{ color: '#666' }}>管理照片交付流程</p>
                  </Card>
                </Col>
              </Row>
            ),
          },
        ] : []),
      ]} />
    </div>
  )
}

export default DashboardPage
