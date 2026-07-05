import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Input, Select, DatePicker, Button, Card, Typography, message, InputNumber } from 'antd'
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { bookingApi } from '../../api/bookingApi'
import dayjs from 'dayjs'

const { Title } = Typography
const { TextArea } = Input

const SHOOT_TYPES = [
  { label: '婚纱摄影', value: 'WEDDING' },
  { label: '写真摄影', value: 'PORTRAIT' },
  { label: '风光摄影', value: 'LANDSCAPE' },
  { label: '商业摄影', value: 'COMMERCIAL' },
  { label: '街拍', value: 'STREET' },
  { label: '其他', value: 'OTHER' },
]

const TIME_SLOTS = [
  { label: '上午 (8:00-12:00)', value: 'MORNING' },
  { label: '下午 (13:00-17:00)', value: 'AFTERNOON' },
  { label: '傍晚 (17:00-20:00)', value: 'EVENING' },
  { label: '全天', value: 'FULL_DAY' },
]

const BookingCreatePage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const photographerId = Number(searchParams.get('photographerId')) || 0

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      await bookingApi.create({
        photographerId,
        shootType: values.shootType,
        shootDate: values.shootDate.format('YYYY-MM-DD'),
        timeSlot: values.timeSlot,
        location: values.location,
        description: values.description,
        price: values.price || 0,
      })
      message.success('预约已提交，等待摄影师确认！')
      navigate('/dashboard/bookings')
    } catch (err: any) {
      message.error(err.response?.data?.error?.message || '预约失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>
      <Title level={3}>📅 发起预约</Title>
      <Card>
        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item name="shootType" label="拍摄类型"
            rules={[{ required: true, message: '选择拍摄类型' }]}>
            <Select options={SHOOT_TYPES} placeholder="选择拍摄类型" />
          </Form.Item>

          <Form.Item name="shootDate" label={<><CalendarOutlined /> 拍摄日期</>}
            rules={[{ required: true, message: '选择日期' }]}>
            <DatePicker style={{ width: '100%' }}
              disabledDate={(d) => d && d.isBefore(dayjs(), 'day')} />
          </Form.Item>

          <Form.Item name="timeSlot" label="时段"
            rules={[{ required: true, message: '选择时段' }]}>
            <Select options={TIME_SLOTS} placeholder="选择时段" />
          </Form.Item>

          <Form.Item name="location" label={<><EnvironmentOutlined /> 拍摄地点</>}
            rules={[{ required: true, message: '填写拍摄地点' }]}>
            <Input placeholder="例：朝阳公园" />
          </Form.Item>

          <Form.Item name="description" label="拍摄需求">
            <TextArea rows={4} placeholder="描述你的拍摄需求和想法" />
          </Form.Item>

          <Form.Item name="price" label="预算 (¥)">
            <InputNumber min={0} max={100000} style={{ width: '100%' }}
              placeholder="你的预算范围" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              提交预约
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default BookingCreatePage
