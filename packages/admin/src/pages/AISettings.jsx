import { useEffect, useState } from 'react';
import { Typography, Button, Table, Modal, Input, Select, Tag, Popconfirm, Space, message, Empty } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, TagsOutlined } from '@ant-design/icons';
import api from '../api/axios.js';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const TOPICS = [
  { value: 'admissions', label: '📝 Admissions' },
  { value: 'fees', label: '💰 Fees' },
  { value: 'schedule', label: '🕐 Schedule' },
  { value: 'facilities', label: '🏫 Facilities' },
  { value: 'transport', label: '🚌 Transport' },
  { value: 'contact', label: '📞 Contact' },
  { value: 'general', label: 'ℹ️ General' },
  { value: 'exams', label: '📚 Exams' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'food', label: '🍛 Food' },
];

export default function AISettings() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ topic: 'general', title: '', content: '', keywords: '', language: 'en' });

  const fetchEntries = async () => {
    try {
      const res = await api.get('/knowledge');
      setEntries(res.data);
    } catch { message.error('Failed to load knowledge base'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEntries(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ topic: 'general', title: '', content: '', keywords: '', language: 'en' });
    setModalOpen(true);
  };

  const openEdit = (entry) => {
    setEditing(entry);
    setForm({ topic: entry.topic, title: entry.title, content: entry.content, keywords: entry.keywords.join(', '), language: entry.language });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content || !form.keywords) return message.warning('All fields are required');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
      };
      if (editing) {
        await api.put(`/knowledge/${editing._id}`, payload);
        message.success('Updated!');
      } else {
        await api.post('/knowledge', payload);
        message.success('Created!');
      }
      setModalOpen(false);
      fetchEntries();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/knowledge/${id}`);
      message.success('Deleted');
      fetchEntries();
    } catch { message.error('Delete failed'); }
  };

  const topicColors = { admissions: 'blue', fees: 'gold', schedule: 'cyan', facilities: 'green', transport: 'orange', contact: 'purple', general: 'default', exams: 'magenta', sports: 'lime', food: 'volcano' };

  const columns = [
    { title: 'Topic', dataIndex: 'topic', key: 'topic', render: t => <Tag color={topicColors[t]}>{t}</Tag> },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Keywords', dataIndex: 'keywords', key: 'keywords', render: kws => kws.slice(0, 3).map(k => <Tag key={k}>{k}</Tag>) },
    { title: 'Lang', dataIndex: 'language', key: 'language', render: l => l === 'mr' ? '🇮🇳 मराठी' : '🇬🇧 EN' },
    { title: 'Actions', key: 'actions', render: (_, r) => (
      <Space>
        <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)}>Edit</Button>
        <Popconfirm title="Delete entry?" onConfirm={() => handleDelete(r._id)}>
          <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
        </Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Title level={2} style={{ margin: 0 }}>AI Knowledge Base</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', borderRadius: 8 }}>
          Add Entry
        </Button>
      </div>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        The chatbot uses these entries to answer visitor questions. Add knowledge about the school — admissions, fees, schedule, etc.
      </Paragraph>
      <Table columns={columns} dataSource={entries} rowKey="_id" loading={loading} style={{ borderRadius: 12, overflow: 'hidden' }} />
      <Modal title={editing ? 'Edit Knowledge Entry' : 'Add Knowledge Entry'} open={modalOpen} width={640}
        onOk={handleSubmit} onCancel={() => setModalOpen(false)} confirmLoading={submitting}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Select value={form.topic} onChange={v => setForm({ ...form, topic: v })} style={{ width: '100%' }} options={TOPICS} />
          <Input placeholder="Title (e.g. Admission Process)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <TextArea placeholder="Content — detailed information the chatbot should know" value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })} rows={6} />
          <Input prefix={<TagsOutlined />} placeholder="Keywords (comma-separated: admission, प्रवेश, fee)"
            value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} />
          <Select value={form.language} onChange={v => setForm({ ...form, language: v })} style={{ width: '100%' }}
            options={[{ value: 'en', label: '🇬🇧 English' }, { value: 'mr', label: '🇮🇳 Marathi' }]} />
        </Space>
      </Modal>
    </div>
  );
}
