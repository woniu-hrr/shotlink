import { useEffect, useState } from 'react'
import { Typography, Card, Row, Col, Button, Spin, Statistic } from 'antd'
import {
  SearchOutlined, CameraOutlined, TeamOutlined, PictureOutlined,
  RightOutlined, StarFilled, FireOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { portfolioApi } from '../../api/portfolioApi'
import type { Portfolio } from '../../api/portfolioApi'
import ParticleBackground from '../../components/ParticleBackground'
import './HomePage.css'

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
    { icon: <CameraOutlined />, title: '3000+', subtitle: '认证摄影师', color: '#1677ff', bg: '#e6f4ff' },
    { icon: <StarFilled />, title: '50,000+', subtitle: '完成拍摄', color: '#52c41a', bg: '#f6ffed' },
    { icon: <TeamOutlined />, title: '100,000+', subtitle: '平台用户', color: '#fa8c16', bg: '#fff7e6' },
  ]

  const steps = [
    { step: '01', icon: <SearchOutlined />, title: '发现摄影师', desc: '按地区、风格、价格精准筛选' },
    { step: '02', icon: <CameraOutlined />, title: '在线预约', desc: '查看档期，一键发起预约请求' },
    { step: '03', icon: <PictureOutlined />, title: '拍摄交付', desc: '摄影师拍摄后在线交付作品' },
  ]

  return (
    <div className="home-page">
      {/* ========== Hero ========== */}
      <section className="hero-section">
        <ParticleBackground count={100} />
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <FireOutlined /> 全新升级 · 2026
          </div>
          <h1 className="hero-title">
            连接<span className="gradient-text">摄影师</span>与
            <br />
            每一个<span className="gradient-text">美好瞬间</span>
          </h1>
          <p className="hero-subtitle">
            ShotLink 摄链 — 发现优秀摄影师、在线预约拍摄、社区交流分享，一站式摄影服务平台
          </p>
          <div className="hero-actions">
            <Button type="primary" size="large" className="btn-primary-glow"
              onClick={() => navigate('/photographers')}>
              发现摄影师 <RightOutlined />
            </Button>
            <Button size="large" className="btn-outline"
              onClick={() => navigate('/register')}>
              成为摄影师
            </Button>
          </div>

          {/* Stats */}
          <Row gutter={[48, 24]} className="hero-stats" justify="center">
            {features.map((f, i) => (
              <Col key={i}>
                <div className="stat-item">
                  <span className="stat-number">{f.title}</span>
                  <span className="stat-label">{f.subtitle}</span>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ========== How It Works ========== */}
      <section className="section">
        <div className="section-header">
          <Title level={2}>如何运作</Title>
          <Paragraph type="secondary">三步完成你的专属拍摄</Paragraph>
        </div>
        <Row gutter={[32, 32]} justify="center">
          {steps.map((s, i) => (
            <Col xs={24} sm={8} key={i}>
              <div className="step-card">
                <span className="step-number">{s.step}</span>
                <div className="step-icon">{s.icon}</div>
                <Title level={4}>{s.title}</Title>
                <Paragraph type="secondary">{s.desc}</Paragraph>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* ========== Popular Works ========== */}
      <section className="section section-dark">
        <div className="section-header">
          <Title level={2} style={{ color: '#fff' }}>🔥 精选作品</Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.7)' }}>发现摄影师的精彩创作</Paragraph>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
        ) : (
          <Row gutter={[20, 20]}>
            {popularWorks.slice(0, 8).map((p) => (
              <Col xs={24} sm={12} md={6} key={p.id}>
                <div className="work-card" onClick={() => navigate(`/portfolios/${p.id}`)}>
                  <div className="work-card-img"
                    style={p.coverUrl ? { backgroundImage: `url(${p.coverUrl})` } : undefined}>
                    {!p.coverUrl && <PictureOutlined style={{ fontSize: 40, color: '#555' }} />}
                    <div className="work-card-overlay">
                      <Title level={5} style={{ color: '#fff', margin: 0 }}>{p.title}</Title>
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                        {p.viewCount} 浏览 · {p.imageCount} 张
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Button ghost size="large" onClick={() => navigate('/portfolios')}>
            浏览全部作品 <RightOutlined />
          </Button>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="section cta-section">
        <Title level={2} style={{ color: '#fff' }}>准备好开始了吗？</Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 32 }}>
          无论你是想找摄影师记录重要时刻，还是想展示你的摄影才华，ShotLink 都是你的最佳选择
        </Paragraph>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button type="primary" size="large" onClick={() => navigate('/register')}
            style={{ height: 48, paddingInline: 32, borderRadius: 24, fontSize: 16 }}>
            免费注册
          </Button>
          <Button ghost size="large" onClick={() => navigate('/photographers')}
            style={{ height: 48, paddingInline: 32, borderRadius: 24, fontSize: 16 }}>
            浏览摄影师
          </Button>
        </div>
      </section>
    </div>
  )
}

export default HomePage
