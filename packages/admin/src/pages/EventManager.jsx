import { useEffect, useState } from 'react';
import { Typography, Button, Table, Modal, Input, DatePicker, Select, Switch, Upload, Popconfirm, Tag, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, StarOutlined, UploadOutlined } from '@ant-design/icons';
import api from '../api/axios.js';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

export default function EventManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: null, category: 'events', featured: false });
  const [fileList, setFileList] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      message.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openCreate = () => {
    setEditingEvent(null);
    setForm({ title: '', description: '', date: null, category: 'events', featured: false });
    setFileList([]);
    setModalOpen(true);
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      date: dayjs(event.date),
      category: event.category,
      featured: event.featured,
    });
    setFileList(event.coverImageUrl ? [{
      uid: '-1',
      name: 'Existing Image',
      status: 'done',
      url: event.coverImageUrl,
    }] : []);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.date) return message.warning('Title and date are required');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('date', form.date.toISOString());
      formData.append('category', form.category);
      formData.append('featured', form.featured);
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('coverImage', fileList[0].originFileObj);
      }

      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        message.success('Event updated!');
      } else {
        await api.post('/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        message.success('Event created!');
      }
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      message.success('Event and its images deleted');
      fetchEvents();
    } catch (err) {
      message.error('Delete failed');
    }
  };

  const columns = [
    { title: 'Cover', dataIndex: 'coverImageUrl', key: 'coverImageUrl', width: 80, render: (url) => (
      url ? <img src={url} alt="Cover" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : <div style={{ width: 40, height: 40, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🖼️</div>
    )},
    { title: 'Title', dataIndex: 'title', key: 'title', render: (text, record) => (
      <Space>{text}{record.featured && <StarOutlined style={{ color: '#f59e0b' }} />}</Space>
    )},
    { title: 'Category', dataIndex: 'category', key: 'category', render: c => <Tag>{c}</Tag> },
    { title: 'Date', dataIndex: 'date', key: 'date', render: d => dayjs(d).format('DD MMM YYYY') },
    { title: 'Gallery Photos', dataIndex: 'imageCount', key: 'imageCount', render: c => `📸 ${c}` },
    { title: 'Actions', key: 'actions', render: (_, record) => (
      <Space>
        <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)}>Edit</Button>
        <Popconfirm title="Delete event and all its photos?" onConfirm={() => handleDelete(record._id)}>
          <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
        </Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Events</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', borderRadius: 8 }}>
          Create Event
        </Button>
      </div>

      <Table columns={columns} dataSource={events} rowKey="_id" loading={loading}
        style={{ borderRadius: 12, overflow: 'hidden' }} />

      <Modal title={editingEvent ? 'Edit Event' : 'Create Event'} open={modalOpen}
        onOk={handleSubmit} onCancel={() => setModalOpen(false)} confirmLoading={submitting}
        okText={editingEvent ? 'Update' : 'Create'}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input placeholder="Event title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <TextArea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
          <DatePicker style={{ width: '100%' }} value={form.date} onChange={v => setForm({ ...form, date: v })} />
          <Select value={form.category} onChange={v => setForm({ ...form, category: v })} style={{ width: '100%' }}
            options={[
              { value: 'academics', label: 'Academics' },
              { value: 'sports', label: 'Sports' },
              { value: 'arts', label: 'Arts & Culture' },
              { value: 'events', label: 'Events' },
            ]} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch checked={form.featured} onChange={v => setForm({ ...form, featured: v })} />
            <span>Featured Event (show on homepage)</span>
          </div>
          <Upload listType="picture-card" fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList.slice(-1))}
            beforeUpload={() => false} accept="image/jpeg,image/png,image/webp" maxCount={1}>
            {fileList.length === 0 && <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>Cover Image</div></div>}
          </Upload>
        </Space>
      </Modal>
    </div>
  );
}
