import { useEffect, useState, useRef } from 'react';
import {
  Typography, Button, Table, Modal, Input, InputNumber, Select,
  Switch, Popconfirm, Tag, Space, message, Upload, Avatar, Badge, Tooltip,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, EditOutlined, UploadOutlined,
  UserOutlined, CheckCircleOutlined, StopOutlined,
} from '@ant-design/icons';
import api from '../api/axios.js';

const { Title, Text } = Typography;
const { TextArea } = Input;

const DEPT_COLORS = {
  Teaching: 'blue', Foundation: 'purple', 'Non-Teaching': 'orange', Management: 'green',
};

const DEPARTMENTS = ['Teaching', 'Foundation', 'Non-Teaching', 'Management'];

const defaultForm = {
  name: '', designation: '', department: 'Teaching',
  description: '', qualification: '', order: '', isActive: true,
};

export default function StaffManager() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      // Admin sees all (including inactive) — use auth header so backend skips isActive filter
      const res = await api.get('/staff');
      // res.data = { data: [...] }
      setStaff(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch {
      message.error('Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  // ── Open create modal ──────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setPhotoFile(null);
    setPhotoPreview(null);
    setModalOpen(true);
  };

  // ── Open edit modal ────────────────────────────────────────────
  const openEdit = (member) => {
    setEditing(member);
    setForm({
      name: member.name || '',
      designation: member.designation || '',
      department: member.department || 'Teaching',
      description: member.description || '',
      qualification: member.qualification || '',
      order: member.order ?? '',
      isActive: member.isActive !== false,
    });
    setPhotoFile(null);
    setPhotoPreview(member.photo || null);
    setModalOpen(true);
  };

  // ── Handle photo selection ─────────────────────────────────────
  const handlePhotoChange = (info) => {
    const file = info.file.originFileObj || info.file;
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // ── Submit form ────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.name?.trim()) {
      return message.warning('Name is required');
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (photoFile) formData.append('photo', photoFile);

      if (editing) {
        await api.put(`/staff/${editing._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Staff member updated!');
      } else {
        await api.post('/staff', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success('Staff member added!');
      }
      setModalOpen(false);
      fetchStaff();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await api.delete(`/staff/${id}`);
      message.success('Staff member deleted');
      fetchStaff();
    } catch {
      message.error('Delete failed');
    }
  };

  // ── Table columns ──────────────────────────────────────────────
  const columns = [
    {
      title: '#',
      dataIndex: 'order',
      key: 'order',
      width: 55,
      sorter: (a, b) => a.order - b.order,
      render: (v) => <Text type="secondary" style={{ fontSize: 12 }}>{v}</Text>,
    },
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      width: 70,
      render: (photo, r) => (
        <Avatar
          src={photo || undefined}
          icon={!photo && <UserOutlined />}
          size={44}
          style={{ background: photo ? undefined : '#4f46e5' }}
        >
          {!photo && r.name?.[0]?.toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, r) => (
        <div>
          <Text strong>{name}</Text>
          {r.qualification && <div><Text type="secondary" style={{ fontSize: 12 }}>{r.qualification}</Text></div>}
        </div>
      ),
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (d) => <Tag color={DEPT_COLORS[d] || 'default'}>{d || '—'}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 90,
      render: (a) => a
        ? <Badge status="success" text="Active" />
        : <Badge status="default" text="Inactive" />,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_, r) => (
        <Space>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)} />
          </Tooltip>
          <Popconfirm
            title="Delete this staff member?"
            description="This will also remove their photo from Cloudinary."
            onConfirm={() => handleDelete(r._id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ── Stats bar ──────────────────────────────────────────────────
  const activeCount = staff.filter((s) => s.isActive !== false).length;
  const deptCounts = DEPARTMENTS.map((d) => ({
    dept: d, count: staff.filter((s) => s.department === d).length,
  }));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Title level={2} style={{ margin: 0 }}>Staff Manager</Title>
        <Button
          type="primary" icon={<PlusOutlined />} onClick={openCreate}
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', borderRadius: 8 }}
        >
          Add Staff
        </Button>
      </div>

      {/* Stats */}
      <Space wrap style={{ marginBottom: 20 }}>
        <Tag color="blue" style={{ padding: '4px 12px', borderRadius: 20 }}>
          Total: {staff.length}
        </Tag>
        <Tag color="green" icon={<CheckCircleOutlined />} style={{ padding: '4px 12px', borderRadius: 20 }}>
          Active: {activeCount}
        </Tag>
        {staff.length - activeCount > 0 && (
          <Tag color="default" icon={<StopOutlined />} style={{ padding: '4px 12px', borderRadius: 20 }}>
            Inactive: {staff.length - activeCount}
          </Tag>
        )}
        {deptCounts.filter((d) => d.count > 0).map(({ dept, count }) => (
          <Tag key={dept} color={DEPT_COLORS[dept]} style={{ padding: '4px 12px', borderRadius: 20 }}>
            {dept}: {count}
          </Tag>
        ))}
      </Space>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={staff}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 15, showSizeChanger: false }}
        style={{ borderRadius: 12, overflow: 'hidden' }}
        locale={{ emptyText: 'No staff added yet. Click "Add Staff" to get started.' }}
      />

      {/* Add / Edit Modal */}
      <Modal
        title={editing ? `Edit — ${editing.name}` : 'Add New Staff Member'}
        open={modalOpen}
        width={600}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        okText={editing ? 'Save Changes' : 'Add Staff'}
        destroyOnClose
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">

          {/* Photo upload */}
          <div style={{ textAlign: 'center' }}>
            <Avatar
              src={photoPreview || undefined}
              icon={!photoPreview && <UserOutlined />}
              size={90}
              style={{ background: photoPreview ? undefined : '#e0e7ff', color: '#4f46e5', marginBottom: 10 }}
            />
            <div>
              <Upload
                showUploadList={false}
                accept="image/*"
                beforeUpload={() => false}
                onChange={handlePhotoChange}
              >
                <Button icon={<UploadOutlined />} size="small">
                  {photoPreview ? 'Change Photo' : 'Upload Photo'}
                </Button>
              </Upload>
            </div>
          </div>

          <Input
            placeholder="Full Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Designation (e.g. Principal, M.A., B.Ed.)"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
          />
          <Input
            placeholder="Qualification (e.g. M.Sc., B.Ed.)"
            value={form.qualification}
            onChange={(e) => setForm({ ...form, qualification: e.target.value })}
          />
          <Select
            value={form.department}
            onChange={(v) => setForm({ ...form, department: v })}
            style={{ width: '100%' }}
            options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
            placeholder="Department"
          />
          <TextArea
            placeholder="Short description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Display Order (lower = first)</Text>
              <InputNumber
                min={0} max={999}
                value={form.order}
                onChange={(v) => setForm({ ...form, order: v ?? '' })}
                style={{ width: '100%', marginTop: 4 }}
              />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>Active on website</Text>
              <div style={{ marginTop: 6 }}>
                <Switch
                  checked={form.isActive}
                  onChange={(v) => setForm({ ...form, isActive: v })}
                />
              </div>
            </div>
          </div>
        </Space>
      </Modal>
    </div>
  );
}
