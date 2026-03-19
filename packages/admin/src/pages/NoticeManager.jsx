import { useEffect, useState } from 'react';
import { Typography, Button, Table, Modal, Input, DatePicker, Select, Switch, Popconfirm, Tag, Badge, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import api from '../api/axios.js';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

export default function NoticeManager() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: null, priority: 'normal', isActive: true, isPopup: false });

  const fetchNotices = async () => {
    try {
      const res = await api.get('/notices');
      setNotices(res.data);
    } catch { message.error('Failed to load notices'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotices(); }, []);

  const openCreate = () => {
    setEditingNotice(null);
    setForm({ title: '', description: '', date: null, priority: 'normal', isActive: true, isPopup: false });
    setModalOpen(true);
  };

  const openEdit = (notice) => {
    setEditingNotice(notice);
    setForm({ title: notice.title, description: notice.description, date: dayjs(notice.date), priority: notice.priority, isActive: notice.isActive, isPopup: !!notice.isPopup });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.date) return message.warning('All fields are required');
    setSubmitting(true);
    try {
      const payload = { ...form, date: form.date.toISOString() };
      if (editingNotice) {
        await api.put(`/notices/${editingNotice._id}`, payload);
        message.success('Notice updated!');
      } else {
        await api.post('/notices', payload);
        message.success('Notice created!');
      }
      setModalOpen(false);
      fetchNotices();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notices/${id}`);
      message.success('Notice deleted');
      fetchNotices();
    } catch { message.error('Delete failed'); }
  };

  const priorityColors = { normal: 'default', important: 'orange', urgent: 'red' };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Date', dataIndex: 'date', key: 'date', render: d => dayjs(d).format('DD MMM YYYY') },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: p => <Tag color={priorityColors[p]}>{p.toUpperCase()}</Tag> },
    { title: 'Status', dataIndex: 'isActive', key: 'isActive', render: a => a ? <Badge status="success" text="Active" /> : <Badge status="default" text="Inactive" /> },
    { title: 'Popup', dataIndex: 'isPopup', key: 'isPopup', render: p => p ? <Tag color="purple">📢 Popup</Tag> : <Tag>—</Tag> },
    { title: 'Actions', key: 'actions', render: (_, r) => (
      <Space>
        <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)}>Edit</Button>
        <Popconfirm title="Delete notice?" onConfirm={() => handleDelete(r._id)}>
          <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
        </Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Notices</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', borderRadius: 8 }}>
          Add Notice
        </Button>
      </div>
      <Table columns={columns} dataSource={notices} rowKey="_id" loading={loading} style={{ borderRadius: 12, overflow: 'hidden' }} />
      <Modal title={editingNotice ? 'Edit Notice' : 'Create Notice'} open={modalOpen}
        onOk={handleSubmit} onCancel={() => setModalOpen(false)} confirmLoading={submitting}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input placeholder="Notice title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <TextArea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} />
          <DatePicker style={{ width: '100%' }} value={form.date} onChange={v => setForm({ ...form, date: v })} />
          <Select value={form.priority} onChange={v => setForm({ ...form, priority: v })} style={{ width: '100%' }}
            options={[
              { value: 'normal', label: '🟢 Normal' },
              { value: 'important', label: '🟡 Important' },
              { value: 'urgent', label: '🔴 Urgent' },
            ]} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch checked={form.isActive} onChange={v => setForm({ ...form, isActive: v })} />
            <span>Active (visible on website)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch
              checked={form.isPopup}
              onChange={v => setForm({ ...form, isPopup: v })}
              style={form.isPopup ? { backgroundColor: '#7c3aed' } : {}}
            />
            <span>📢 Show as corner popup announcement</span>
          </div>
        </Space>
      </Modal>
    </div>
  );
}
