import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Button, Input, List, Tag, Space, Spin, message, Avatar } from 'antd'
import { LikeOutlined, LikeFilled, ArrowLeftOutlined, SendOutlined } from '@ant-design/icons'
import { communityApi } from '../../api/communityApi'
import type { CommunityPost, CommunityComment } from '../../api/communityApi'
import { useAuthStore } from '../../stores/authStore'
import dayjs from 'dayjs'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [comments, setComments] = useState<CommunityComment[]>([])
  const [liked, setLiked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    communityApi.getPost(Number(id)).then((res) => setPost(res.data.data))
    communityApi.getComments(Number(id)).then((res) => setComments(res.data.data || []))
    if (isAuthenticated) {
      communityApi.checkLike('POST', Number(id)).then((res) =>
        setLiked(res.data.data?.liked || false))
    }
    setLoading(false)
  }, [id])

  const handleLike = async () => {
    if (!isAuthenticated) { message.warning('请先登录'); return }
    const res = await communityApi.toggleLike('POST', post!.id)
    setLiked(res.data.data.liked)
    if (post) post.likeCount += res.data.data.liked ? 1 : -1
  }

  const handleComment = async () => {
    if (!commentText.trim()) return
    await communityApi.addComment(Number(id), commentText)
    setCommentText('')
    message.success('评论成功')
    const res = await communityApi.getComments(Number(id))
    setComments(res.data.data || [])
  }

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
  if (!post) return <div>帖子不存在</div>

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/community')}
        style={{ marginBottom: 16 }}>返回社区</Button>

      <Title level={2}>{post.title}</Title>
      <Space style={{ marginBottom: 16, color: '#999' }}>
        <Avatar size="small">{post.user?.displayName?.[0]}</Avatar>
        <span>{post.user?.displayName}</span>
        <span>{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}</span>
        <Tag color="blue">{post.category}</Tag>
        <span>{post.viewCount} 次浏览</span>
      </Space>

      <div style={{
        background: '#fafafa', padding: 24, borderRadius: 8, marginBottom: 24,
        whiteSpace: 'pre-wrap', lineHeight: 1.8,
      }}>
        {post.content}
      </div>

      <div style={{ marginBottom: 24 }}>
        <Button icon={liked ? <LikeFilled /> : <LikeOutlined />}
          onClick={handleLike} type={liked ? 'primary' : 'default'}>
          {liked ? '已赞' : '点赞'} ({post.likeCount})
        </Button>
      </div>

      {/* Comments */}
      <Title level={4}>评论 ({comments.length})</Title>
      {isAuthenticated && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <TextArea rows={2} value={commentText} onChange={(e) => setCommentText(e.target.value)}
            placeholder="写下你的评论..." style={{ flex: 1 }} />
          <Button type="primary" icon={<SendOutlined />} onClick={handleComment}>发送</Button>
        </div>
      )}

      <List
        dataSource={comments}
        renderItem={(c) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>{c.user?.displayName?.[0]}</Avatar>}
              title={<Text strong>{c.user?.displayName}</Text>}
              description={
                <div>
                  <div>{c.content}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(c.createdAt).format('MM-DD HH:mm')}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )
}

export default PostDetailPage
