import { useState, useEffect } from 'react';
import {
  Table, Tag, Button, Select, Input, Space, Typography,
  Popconfirm, message, Badge, Card, Row, Col, Statistic, Tooltip
} from 'antd';
import {
  DeleteOutlined, EyeOutlined, PhoneOutlined,
  SearchOutlined, UserOutlined, ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../api/axios.js';

const { Title, Text } = Typography;
const { Option } = Select;

const STATUS_COLOR = { new: 'red', seen: 'blue', contacted: 'green' };
const STATUS_LABEL = { new: 'नवीन', seen: 'पाहिले', contacted: 'संपर्क झाला' };

export default function EnquiryManager() {
  const [enquiries, setEnquiries]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const res = await api.get(`/enquiries${params}`);
      setEnquiries(res.data);
    } catch {
      message.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEnquiries(); }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/enquiries/${id}/status`, { status });
      message.success('Status updated');
      fetchEnquiries();
    } catch {
      message.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/enquiries/${id}`);
      message.success('Enquiry deleted');
      fetchEnquiries();
    } catch {
      message.error('Failed to delete');
    }
  };

  // Stats
  const newCount      = enquiries.filter(e => e.status === 'new').length;
  const seenCount     = enquiries.filter(e => e.status === 'seen').length;
  const contactedCount = enquiries.filter(e => e.status === 'contacted').length;

  // Client-side search filter
  const filtered = enquiries.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.phone.includes(search) ||
    (e.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'दिनांक',
      dataIndex: 'createdAt',
      key: 'date',
      width: 150,
      render: (v) => (
        <Text style={{ fontSize: 12 }}>
          {dayjs(v).format('DD MMM YYYY')}<br />
          <Text type="secondary" style={{ fontSize: 11 }}>{dayjs(v).format('hh:mm A')}</Text>
        </Text>
      ),
    },
    {
      title: 'विद्यार्थी',
      key: 'student',
      render: (_, r) => (
        <div>
          <Text strong><UserOutlined style={{ marginRight: 6 }} />{r.name}</Text><br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            <PhoneOutlined style={{ marginRight: 4 }} />{r.phone}
          </Text>
          {r.email && <><br /><Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text></>}
        </div>
      ),
    },
    {
      title: 'इयत्ता',
      dataIndex: 'standard',
      key: 'standard',
      width: 90,
      render: (v) => v || '—',
    },
    {
      title: 'मागील शाळा',
      dataIndex: 'previousSchool',
      key: 'school',
      render: (v) => v || '—',
    },
    {
      title: 'संदेश',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (v) => v ? (
        <Tooltip title={v}><Text style={{ maxWidth: 200, display: 'inline-block' }}>{v}</Text></Tooltip>
      ) : '—',
    },
    {
      title: 'स्थिती',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          onChange={(val) => handleStatusChange(record._id, val)}
          style={{ width: 140 }}
        >
          <Option value="new"><Tag color="red">नवीन</Tag></Option>
          <Option value="seen"><Tag color="blue">पाहिले</Tag></Option>
          <Option value="contacted"><Tag color="green">संपर्क झाला</Tag></Option>
        </Select>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_, record) => (
        <Popconfirm
          title="हा रेकॉर्ड कायमचा हटवायचा?"
          onConfirm={() => handleDelete(record._id)}
          okText="हो"
          cancelText="नाही"
        >
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        प्रवेश अर्ज
        <Badge count={newCount} style={{ marginLeft: 12, background: '#ef4444' }} />
      </Title>

      {/* Stats Row */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false} style={{ background: '#fef2f2', borderRadius: 12 }}>
            <Statistic title="नवीन अर्ज" value={newCount} valueStyle={{ color: '#ef4444' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ background: '#eff6ff', borderRadius: 12 }}>
            <Statistic title="पाहिलेले" value={seenCount} valueStyle={{ color: '#3b82f6' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ background: '#f0fdf4', borderRadius: 12 }}>
            <Statistic title="संपर्क झाला" value={contactedCount} valueStyle={{ color: '#22c55e' }} />
          </Card>
        </Col>
      </Row>

      {/* Toolbar */}
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <Space wrap>
          <Input
            prefix={<SearchOutlined />}
            placeholder="नाव, फोन किंवा ईमेल शोधा..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Select
            value={statusFilter || 'all'}
            onChange={v => setStatusFilter(v === 'all' ? '' : v)}
            style={{ width: 160 }}
          >
            <Option value="all">सर्व अर्ज</Option>
            <Option value="new">नवीन</Option>
            <Option value="seen">पाहिलेले</Option>
            <Option value="contacted">संपर्क झाला</Option>
          </Select>
        </Space>
        <Button icon={<ReloadOutlined />} onClick={fetchEnquiries}>रिफ्रेश</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="_id"
        loading={loading}
        rowClassName={(r) => r.status === 'new' ? 'enquiry-row-new' : ''}
        pagination={{ pageSize: 15, showTotal: (total) => `एकूण ${total} अर्ज` }}
        scroll={{ x: 800 }}
        locale={{ emptyText: 'कोणतेही अर्ज आढळले नाहीत' }}
      />

      <style>{`
        .enquiry-row-new { background: #fff7ed !important; font-weight: 500; }
        .enquiry-row-new:hover > td { background: #ffedd5 !important; }
      `}</style>
    </div>
  );
}
