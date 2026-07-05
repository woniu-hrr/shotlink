import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Typography, Tag, Space, Button, Spin, Empty, Tabs } from 'antd'
import { EyeOutlined, LikeOutlined, CommentOutlined, PlusOutlined } from '@ant-design/icons'
import { communityApi } from '../../api/communityApi'
import type { CommunityPost } from '../../api/communityApi'
import dayjs from 'dayjs'

const { Title, Paragraph } = Typography

const CATEGORIES = [
  { key: '', label: '全部' },
  { key: 'GENERAL', label: '综合讨论' },
  { key: 'TECHNIQUE', label: '拍摄技巧' },
  { key: 'GEAR', label: '器材交流' },
  { key: 'SHOWCASE', label: '作品分享' },
  { key: 'QNA', label: '问答求助' },
]

const CommunityListPage = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')

  useEffect(() => {
    setLoading(true)
    communityApi.getPosts(category || undefined).then((res) => {
      setPosts(res.data.data?.content || [])
      setLoading(false)
    })
  }, [category])

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>📸 摄影社区</Title>
        <Button type="primary" icon={<PlusOutlined />}
          onClick={() => navigate('/community/new')}>
          发布帖子
        </Button>
      </div>

      <Tabs activeKey={category} onChange={setCategory}
        items={CATEGORIES.map((c) => ({ key: c.key, label: c.label }))}
        style={{ marginBottom: 16 }}
      />

      {loading ? <Spin size="large" style={{ display: 'block', margin: '40px auto' }} /> :
       posts.length === 0 ? <Empty description="暂无帖子" /> :
       posts.map((post) => (
        <Card key={post.id} hoverable style={{ marginBottom: 12 }}
          onClick={() => navigate(`/community/${post.id}`)}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <Title level={4} style={{ marginBottom: 4 }}>{post.title}</Title>
              <Paragraph type="secondary" ellipsis={{ rows: 2 }}
                style={{ marginBottom: 8 }}>
                {post.content.substring(0, 200)}
              </Paragraph>
              <Space size="small">
                {post.tags?.map((t) => <Tag key={t}>{t}</Tag>)}
                <Tag color="blue">{post.category}</Tag>
              </Space>
            </div>
          </div>
          <div style={{ marginTop: 8, color: '#999', fontSize: 13 }}>
            <Space size="middle">
              <span>{post.user?.displayName}</span>
              <span>{dayjs(post.createdAt).format('MM-DD HH:mm')}</span>
              <span><EyeOutlined /> {post.viewCount}</span>
              <span><LikeOutlined /> {post.likeCount}</span>
              <span><CommentOutlined /> {post.commentCount}</span>
            </Space>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default CommunityListPage
