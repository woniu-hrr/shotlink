import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Tag, Button, Typography, Space, message, Spin, Select } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
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
  REJECTED: { color: 'red', label: '已拒绝' },
  CANCELLED: { color: 'default', label: '已取消' },
}

const BookingListPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<'client' | 'photographer'>(
    user?.role === 'PHOTOGRAPHER' ? 'photographer' : 'client'
  )

  useEffect(() => {
    setLoading(true)
    bookingApi.list(role).then((res) => {
      setBookings(res.data.data?.content || [])
      setLoading(false)
    })
  }, [role])

  const handleStatus = async (id: number, status: string) => {
    try {
      await bookingApi.updateStatus(id, status)
      message.success('状态已更新')
      // Refresh
      const res = await bookingApi.list(role)
      setBookings(res.data.data?.content || [])
    } catch (err: any) {
      message.error(err.response?.data?.error?.message || '操作失败')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    {
      title: role === 'photographer' ? '客户' : '摄影师',
      dataIndex: role === 'photographer' ? ['client', 'displayName'] : ['photographer', 'displayName'],
      render: (_: any, r: Booking) =>
        role === 'photographer' ? r.client?.displayName : r.photographer?.displayName,
    },
    { title: '拍摄类型', dataIndex: 'shootType', width: 100 },
    {
      title: '日期',
      dataIndex: 'shootDate',
      render: (d: string) => dayjs(d).format('MM/DD'),
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (s: string) => (
        <Tag color={STATUS_MAP[s]?.color}>{STATUS_MAP[s]?.label || s}</Tag>
      ),
      width: 90,
    },
    { title: '价格', dataIndex: 'price', render: (p: number) => `¥${p || 0}`, width: 80 },
    {
      title: '操作',
      render: (_: any, r: Booking) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />}
            onClick={() => navigate(`/dashboard/bookings/${r.id}`)}>
            详情
          </Button>
          {role === 'photographer' && r.status === 'PENDING' && (
            <>
              <Button size="small" type="primary"
                onClick={() => handleStatus(r.id, 'CONFIRMED')}>确认</Button>
              <Button size="small" danger
                onClick={() => handleStatus(r.id, 'REJECTED')}>拒绝</Button>
            </>
          )}
          {role === 'photographer' && r.status === 'CONFIRMED' && (
            <Button size="small" type="primary"
              onClick={() => handleStatus(r.id, 'SHOOTING')}>开始拍摄</Button>
          )}
          {role === 'photographer' && r.status === 'SHOOTING' && (
            <Button size="small" type="primary"
              onClick={() => handleStatus(r.id, 'DELIVERED')}>标记交付</Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>📋 预约管理</Title>
        <Space>
          <Select value={role} onChange={setRole} style={{ width: 120 }}
            options={[
              { label: '我发起的', value: 'client' },
              { label: '收到的', value: 'photographer' },
            ]} />
          {role === 'client' && (
            <Button type="primary" onClick={() => navigate('/dashboard/bookings/new')}>
              新建预约
            </Button>
          )}
        </Space>
      </div>

      {loading ? <Spin /> : (
        <Table columns={columns} dataSource={bookings} rowKey="id"
          pagination={{ pageSize: 10 }} size="middle" />
      )}
    </div>
  )
}

export default BookingListPage
