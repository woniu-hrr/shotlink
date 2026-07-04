import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd'
import {
  HomeOutlined,
  SearchOutlined,
  TeamOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  CameraOutlined,
} from '@ant-design/icons'

const { Header, Content, Footer } = Layout

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // Temporarily mock auth state (Phase 2 will replace with real auth)
  const [isAuthenticated] = useState(false)

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/photographers', icon: <SearchOutlined />, label: '找摄影师' },
    { key: '/community', icon: <TeamOutlined />, label: '摄影社区' },
  ]

  const userMenuItems = isAuthenticated
    ? [
        { key: 'dashboard', icon: <DashboardOutlined />, label: '工作台' },
        { key: 'settings', icon: <UserOutlined />, label: '个人设置' },
        { type: 'divider' as const },
        { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
      ]
    : []

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      // TODO: Phase 2 logout logic
    } else {
      navigate(`/${key}`)
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              fontSize: 20,
              fontWeight: 700,
              color: '#1677ff',
            }}
            onClick={() => navigate('/')}
          >
            <CameraOutlined />
            ShotLink
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ border: 'none', flex: 1, minWidth: 300 }}
          />
        </div>

        <Space>
          {isAuthenticated ? (
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: ({ key }) => handleMenuClick(key),
              }}
            >
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer', backgroundColor: '#1677ff' }} />
            </Dropdown>
          ) : (
            <>
              <Button type="primary" onClick={() => navigate('/login')}>
                登录
              </Button>
              <Button onClick={() => navigate('/register')}>注册</Button>
            </>
          )}
        </Space>
      </Header>

      <Content>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center', color: '#999' }}>
        ShotLink ©2026 — 连接摄影师与美好瞬间
      </Footer>
    </Layout>
  )
}

export default MainLayout
