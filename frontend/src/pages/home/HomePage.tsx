import { useEffect, useState, useRef } from 'react'
import { Typography, Row, Col, Button, Spin } from 'antd'
import {
  RightOutlined, StarFilled, FireOutlined, ThunderboltOutlined,
  PictureOutlined, SearchOutlined, CameraOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { portfolioApi } from '../../api/portfolioApi'
import type { Portfolio } from '../../api/portfolioApi'
import ParticleBackground from '../../components/ParticleBackground'
import './HomePage.css'

const { Title, Paragraph } = Typography

const TAGS = ['婚纱摄影', '个人写真', '风光大片', '商业摄影', '街拍', '旅拍', '亲子', '宠物', '婚礼跟拍', '毕业照']

const HomePage = () => {
  const navigate = useNavigate()
  const [popularWorks, setPopularWorks] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    portfolioApi.getPopular().then((res) => {
      setPopularWorks(res.data.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="home-page">
      {/* ========== HERO — Split Layout ========== */}
      <section className="hero-fullscreen">
        <ParticleBackground count={120} />
        <div className="hero-bg-glow" />

        <div className="hero-grid">
          {/* Left — Text */}
          <div className="hero-left">
            <div className="hero-pill">
              <ThunderboltOutlined /> AI 智能推荐 · 精准匹配摄影师
            </div>
            <h1 className="hero-heading">
              找到你的<span className="text-gradient-animated">专属</span>
              <br />
              摄影师
            </h1>
            <p className="hero-desc">
              从 3000+ 认证摄影师中发现最匹配你风格的创作者，
              在线预约、一键沟通、轻松交付。
            </p>
            <div className="hero-buttons">
              <button className="btn-neon" onClick={() => navigate('/photographers')}>
                <SearchOutlined /> 开始探索
              </button>
              <button className="btn-ghost-light" onClick={() => navigate('/register')}>
                成为摄影师 <RightOutlined />
              </button>
            </div>
            <div className="hero-numbers" ref={statsRef}>
              <div className="num-block">
                <span className="num-value">3,200<span className="num-plus">+</span></span>
                <span className="num-label">认证摄影师</span>
              </div>
              <div className="num-divider" />
              <div className="num-block">
                <span className="num-value">52K<span className="num-plus">+</span></span>
                <span className="num-label">完成拍摄</span>
              </div>
              <div className="num-divider" />
              <div className="num-block">
                <span className="num-value">4.9</span>
                <span className="num-label">
                  <StarFilled style={{ color: '#fadb14', fontSize: 12 }} />
                  <StarFilled style={{ color: '#fadb14', fontSize: 12 }} />
                  <StarFilled style={{ color: '#fadb14', fontSize: 12 }} />
                  <StarFilled style={{ color: '#fadb14', fontSize: 12 }} />
                  <StarFilled style={{ color: '#fadb14', fontSize: 12 }} />
                </span>
              </div>
            </div>
          </div>

          {/* Right — Visual showcase */}
          <div className="hero-right">
            <div className="hero-visual">
              <div className="floating-card card-1">
                <div className="fc-img" />
                <div className="fc-info">
                  <strong>婚纱旅拍</strong>
                  <span>¥3,000 起</span>
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="fc-img" />
                <div className="fc-info">
                  <strong>城市街拍</strong>
                  <span>¥1,500 起</span>
                </div>
              </div>
              <div className="floating-card card-3">
                <div className="fc-img" />
                <div className="fc-info">
                  <strong>个人写真</strong>
                  <span>¥2,000 起</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling tags */}
        <div className="scroll-tags">
          <div className="scroll-tags-track">
            {[...TAGS, ...TAGS].map((tag, i) => (
              <span key={i} className="scroll-tag">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BENTO Features ========== */}
      <section className="section-bento">
        <div className="bento-header">
          <span className="section-label">WHY SHOTLINK</span>
          <Title level={2}>为什么选择 ShotLink？</Title>
        </div>

        <div className="bento-grid">
          <div className="bento-card bento-large" onClick={() => navigate('/photographers')}>
            <div className="bento-bg bento-bg-1" />
            <div className="bento-content">
              <CameraOutlined className="bento-icon" />
              <h3>智能匹配</h3>
              <p>AI 根据你的需求自动推荐最合适的摄影师，省去筛选时间</p>
              <span className="bento-link">探索摄影师 <RightOutlined /></span>
            </div>
          </div>

          <div className="bento-card" onClick={() => navigate('/community')}>
            <div className="bento-bg bento-bg-2" />
            <div className="bento-content">
              <FireOutlined className="bento-icon" />
              <h3>摄影社区</h3>
              <p>10 万+ 摄影师交流技巧、分享作品</p>
            </div>
          </div>

          <div className="bento-card" onClick={() => navigate('/portfolios')}>
            <div className="bento-bg bento-bg-3" />
            <div className="bento-content">
              <PictureOutlined className="bento-icon" />
              <h3>作品画廊</h3>
              <p>浏览海量精品样片，获取拍摄灵感</p>
            </div>
          </div>

          <div className="bento-card bento-wide" onClick={() => navigate('/register')}>
            <div className="bento-bg bento-bg-4" />
            <div className="bento-content">
              <ThunderboltOutlined className="bento-icon" />
              <h3>一站式管理</h3>
              <p>合同、发票、档期、交付 — 全部在线搞定</p>
              <span className="bento-link">立即入驻 <RightOutlined /></span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== GALLERY Strip ========== */}
      <section className="section-gallery">
        <div className="bento-header">
          <span className="section-label">FEATURED</span>
          <Title level={2} style={{ color: '#fff' }}>精选作品</Title>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
        ) : (
          <div className="gallery-strip">
            {popularWorks.slice(0, 6).map((p) => (
              <div key={p.id} className="gallery-item" onClick={() => navigate(`/portfolios/${p.id}`)}>
                <div className="gi-img"
                  style={p.coverUrl ? { backgroundImage: `url(${p.coverUrl})` } : undefined}>
                  {!p.coverUrl && <PictureOutlined />}
                </div>
                <div className="gi-info">
                  <strong>{p.title}</strong>
                  <span>{p.viewCount} 浏览</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========== CTA ========== */}
      <section className="cta-full">
        <div className="cta-glow" />
        <h2>准备好找到你的摄影师了吗？</h2>
        <p>免费注册 · 浏览作品 · 在线预约 · 一站式完成</p>
        <div className="cta-actions">
          <button className="btn-neon btn-neon-lg" onClick={() => navigate('/register')}>
            立即免费注册
          </button>
          <button className="btn-ghost-light btn-ghost-lg" onClick={() => navigate('/photographers')}>
            先看看摄影师
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage
