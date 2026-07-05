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

      {/* ========== Features — Clean 3-Column ========== */}
      <section className="section-features">
        <div className="bento-header">
          <span className="section-label">WHY SHOTLINK</span>
          <Title level={2}>为什么选择 ShotLink？</Title>
        </div>

        <div className="features-grid">
          <div className="feature-card" onClick={() => navigate('/photographers')}>
            <div className="feature-icon-box">
              <SearchOutlined />
            </div>
            <h3>智能匹配</h3>
            <p>AI 根据风格和预算自动推荐最合适的摄影师</p>
            <span className="feature-stat">3,200+ 认证摄影师</span>
          </div>

          <div className="feature-card" onClick={() => navigate('/community')}>
            <div className="feature-icon-box">
              <FireOutlined />
            </div>
            <h3>摄影社区</h3>
            <p>与 10 万+ 摄影师交流技巧、分享作品</p>
            <span className="feature-stat">2.8k 在线讨论</span>
          </div>

          <div className="feature-card" onClick={() => navigate('/portfolios')}>
            <div className="feature-icon-box">
              <PictureOutlined />
            </div>
            <h3>作品画廊</h3>
            <p>海量精品样片，发现最新摄影趋势与灵感</p>
            <span className="feature-stat">50,000+ 作品</span>
          </div>

          <div className="feature-card" onClick={() => navigate('/register')}>
            <div className="feature-icon-box">
              <ThunderboltOutlined />
            </div>
            <h3>一站式管理</h3>
            <p>合同、发票、档期、交付，全部在线搞定</p>
            <span className="feature-stat">免费入驻</span>
          </div>
        </div>
      </section>

      {/* ========== Works Gallery ========== */}
      <section className="section-gallery">
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
    </div>
  )
}

export default HomePage
