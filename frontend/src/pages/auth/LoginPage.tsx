import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message, Space } from 'antd'
import { MailOutlined, LockOutlined, CameraOutlined } from '@ant-design/icons'
import { authApi } from '../../api/authApi'
import { useAuthStore } from '../../stores/authStore'

const { Title, Text } = Typography

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    try {
      const response = await authApi.login(values)
      const { accessToken, refreshToken, userId, email, displayName, role } = response.data.data
      login(accessToken, refreshToken, {
        id: userId,
        email,
        name: displayName,
        role,
      })
      message.success('登录成功！')
      navigate('/')
    } catch (err: any) {
      const errorMsg = err.response?.data?.error?.message || '登录失败，请重试'
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
      }}
    >
      <Card style={{ width: 420, borderRadius: 12 }} bodyStyle={{ padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <CameraOutlined style={{ fontSize: 48, color: '#1677ff' }} />
          <Title level={2} style={{ marginTop: 16, marginBottom: 4 }}>
            ShotLink
          </Title>
          <Text type="secondary">摄影师服务平台</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large">
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
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 12 }}>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Space>
            <Text>还没有账号？</Text>
            <Link to="/register">立即注册</Link>
          </Space>
        </div>
      </Card>
    </div>
  )
}

export default LoginPage
