import { useEffect, useState } from 'react';
import { Typography, Button, Table, Modal, Input, Select, Switch, Popconfirm, Tag, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, StarOutlined, PlayCircleOutlined } from '@ant-design/icons';
import api from '../api/axios.js';

const { Title } = Typography;
const { TextArea } = Input;

export default function VideoManager() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', youtubeUrl: '', category: 'events', featured: false });

  const fetchVideos = async () => {
    try {
      const res = await api.get('/videos');
      setVideos(res.data);
    } catch { message.error('Failed to load videos'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVideos(); }, []);

  const openCreate = () => {
    setEditingVideo(null);
    setForm({ title: '', description: '', youtubeUrl: '', category: 'events', featured: false });
    setModalOpen(true);
  };

  const openEdit = (video) => {
    setEditingVideo(video);
    setForm({ title: video.title, description: video.description, youtubeUrl: video.youtubeUrl, category: video.category, featured: video.featured });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.youtubeUrl) return message.warning('Title and YouTube URL are required');
    setSubmitting(true);
    try {
      if (editingVideo) {
        await api.put(`/videos/${editingVideo._id}`, form);
        message.success('Video updated!');
      } else {
        await api.post('/videos', form);
        message.success('Video added!');
      }
      setModalOpen(false);
      fetchVideos();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/videos/${id}`);
      message.success('Video deleted');
      fetchVideos();
    } catch { message.error('Delete failed'); }
  };

  const columns = [
    { title: 'Thumbnail', key: 'thumb', width: 120, render: (_, r) => (
      <img src={`https://img.youtube.com/vi/${r.youtubeId}/mqdefault.jpg`} alt="" style={{ width: 100, borderRadius: 6 }} />
    )},
    { title: 'Title', dataIndex: 'title', key: 'title', render: (text, r) => (
      <Space>{text}{r.featured && <StarOutlined style={{ color: '#f59e0b' }} />}</Space>
    )},
    { title: 'Category', dataIndex: 'category', key: 'category', render: c => <Tag>{c}</Tag> },
    { title: 'Actions', key: 'actions', render: (_, r) => (
      <Space>
        <Button icon={<PlayCircleOutlined />} size="small" href={r.youtubeUrl} target="_blank">Watch</Button>
        <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)}>Edit</Button>
        <Popconfirm title="Delete video?" onConfirm={() => handleDelete(r._id)}>
          <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
        </Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Videos</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', borderRadius: 8 }}>
          Add Video
        </Button>
      </div>

      <Table columns={columns} dataSource={videos} rowKey="_id" loading={loading}
        style={{ borderRadius: 12, overflow: 'hidden' }} />

      <Modal title={editingVideo ? 'Edit Video' : 'Add Video'} open={modalOpen}
        onOk={handleSubmit} onCancel={() => setModalOpen(false)} confirmLoading={submitting}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input placeholder="Video title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="YouTube URL (e.g. https://youtube.com/watch?v=...)" value={form.youtubeUrl}
            onChange={e => setForm({ ...form, youtubeUrl: e.target.value })} />
          <TextArea placeholder="Description (optional)" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
          <Select value={form.category} onChange={v => setForm({ ...form, category: v })} style={{ width: '100%' }}
            options={[
              { value: 'events', label: 'Events' }, { value: 'academics', label: 'Academics' },
              { value: 'sports', label: 'Sports' }, { value: 'arts', label: 'Arts & Culture' },
            ]} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch checked={form.featured} onChange={v => setForm({ ...form, featured: v })} />
            <span>Featured Video</span>
          </div>
        </Space>
      </Modal>
    </div>
  );
}
