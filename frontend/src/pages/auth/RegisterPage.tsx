import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message, Space, Radio } from 'antd'
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  CameraOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import { authApi } from '../../api/authApi'
import { useAuthStore } from '../../stores/authStore'

const { Title, Text } = Typography

const RegisterPage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await authApi.register(values)
      const { accessToken, refreshToken, userId, email, displayName, role } = response.data.data
      login(accessToken, refreshToken, {
        id: userId,
        email,
        name: displayName,
        role,
      })

      if (role === 'PHOTOGRAPHER') {
        message.success('注册成功！请完善摄影师资料')
        navigate('/dashboard/settings')
      } else {
        message.success('注册成功！')
        navigate('/')
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error?.message || '注册失败，请重试'
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px - 70px)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px 0',
      }}
    >
      <Card style={{ width: 460, borderRadius: 12 }} bodyStyle={{ padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <CameraOutlined style={{ fontSize: 40, color: '#1677ff' }} />
          <Title level={3} style={{ marginTop: 12, marginBottom: 4 }}>
            注册 ShotLink
          </Title>
          <Text type="secondary">选择你的角色开始旅程</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large" initialValues={{ role: 'CLIENT' }}>
          <Form.Item
            name="role"
            label="选择角色"
            rules={[{ required: true }]}
          >
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              style={{ width: '100%', textAlign: 'center' }}
            >
              <Radio.Button value="CLIENT" style={{ width: '50%' }}>
                🧑 找摄影师
              </Radio.Button>
              <Radio.Button value="PHOTOGRAPHER" style={{ width: '50%' }}>
                📸 我是摄影师
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="displayName"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱地址" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码至少8位，包含大小写字母和数字' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: '密码需包含大小写字母和数字',
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码（至少8位）" />
          </Form.Item>

          <Form.Item name="phone">
            <Input prefix={<PhoneOutlined />} placeholder="手机号（选填）" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 12 }}>
            <Button type="primary" htmlType="submit" loading={loading} block>
              注册
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Space>
            <Text>已有账号？</Text>
            <Link to="/login">立即登录</Link>
          </Space>
        </div>
      </Card>
    </div>
  )
}

export default RegisterPage
