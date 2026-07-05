import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Select, Button, Card, Typography, message } from 'antd'
import { communityApi } from '../../api/communityApi'

const { Title } = Typography
const { TextArea } = Input

const CATEGORIES = [
  { label: '综合讨论', value: 'GENERAL' },
  { label: '拍摄技巧', value: 'TECHNIQUE' },
  { label: '器材交流', value: 'GEAR' },
  { label: '作品分享', value: 'SHOWCASE' },
  { label: '问答求助', value: 'QNA' },
]

const PostCreatePage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const res = await communityApi.createPost(values)
      message.success('帖子发布成功！')
      navigate(`/community/${res.data.data.id}`)
    } catch (err: any) {
      message.error(err.response?.data?.error?.message || '发布失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px' }}>
      <Title level={3}>✍️ 发布帖子</Title>
      <Card>
        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item name="title" label="标题"
            rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="给你的帖子起个标题" />
          </Form.Item>

          <Form.Item name="category" label="分类" initialValue="GENERAL">
            <Select options={CATEGORIES} />
          </Form.Item>

          <Form.Item name="content" label="内容"
            rules={[{ required: true, message: '请输入内容' }]}>
            <TextArea rows={10} placeholder="分享你的想法..." />
          </Form.Item>

          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="输入标签后回车"
              style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              发布
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default PostCreatePage
