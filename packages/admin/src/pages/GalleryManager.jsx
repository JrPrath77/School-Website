import { useEffect, useState } from 'react';
import { Typography, Button, Card, Row, Col, Upload, Input, Select, Modal, Image, Space, Tag, Popconfirm, message, Spin, Empty } from 'antd';
import { UploadOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';
import api from '../api/axios.js';

const { Title } = Typography;

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'events', eventId: '' });
  const [fileList, setFileList] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, hasMore: false, total: 0 });

  const fetchImages = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/gallery?page=${page}&limit=20`);
      if (page === 1) {
        setImages(res.data.images);
      } else {
        setImages(prev => [...prev, ...res.data.images]);
      }
      setPagination({ page, hasMore: res.data.pagination.hasMore, total: res.data.pagination.total });
    } catch (err) {
      message.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) { /* events optional */ }
  };

  useEffect(() => { fetchImages(); fetchEvents(); }, []);

  const handleUpload = async () => {
    if (!form.title || fileList.length === 0) {
      return message.warning('Please add a title and select an image');
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', fileList[0].originFileObj);
      formData.append('title', form.title);
      formData.append('category', form.category);
      if (form.eventId) formData.append('eventId', form.eventId);

      await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('Image uploaded!');
      setModalOpen(false);
      setForm({ title: '', category: 'events', eventId: '' });
      setFileList([]);
      fetchImages();
    } catch (err) {
      message.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/gallery/${id}`);
      message.success('Image deleted');
      setImages(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      message.error('Delete failed');
    }
  };

  const categoryColors = { academics: 'blue', sports: 'green', arts: 'purple', events: 'orange' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Gallery ({pagination.total})</Title>
        <Button type="primary" icon={<UploadOutlined />} onClick={() => setModalOpen(true)}
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', borderRadius: 8 }}>
          Upload Image
        </Button>
      </div>

      {loading && images.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: 80 }}><Spin size="large" /></div>
      ) : images.length === 0 ? (
        <Empty description="No images yet. Upload your first image!" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {images.map(img => (
              <Col xs={24} sm={12} md={8} lg={6} key={img._id}>
                <Card
                  hoverable
                  style={{ borderRadius: 12, overflow: 'hidden' }}
                  cover={
                    <Image
                      src={img.imageUrl}
                      alt={img.title}
                      height={200}
                      style={{ objectFit: 'cover' }}
                      preview={{ mask: '🔍 Preview' }}
                    />
                  }
                  actions={[
                    <Popconfirm title="Delete this image?" onConfirm={() => handleDelete(img._id)} key="del">
                      <DeleteOutlined style={{ color: '#dc2626' }} />
                    </Popconfirm>
                  ]}
                >
                  <Card.Meta
                    title={img.title}
                    description={<Tag color={categoryColors[img.category]}>{img.category}</Tag>}
                  />
                </Card>
              </Col>
            ))}
          </Row>
          {pagination.hasMore && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Button onClick={() => fetchImages(pagination.page + 1)} loading={loading}>
                Load More
              </Button>
            </div>
          )}
        </>
      )}

      <Modal
        title="Upload Image"
        open={modalOpen}
        onOk={handleUpload}
        onCancel={() => setModalOpen(false)}
        confirmLoading={uploading}
        okText="Upload"
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input placeholder="Image title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <Select value={form.category} onChange={v => setForm({ ...form, category: v })} style={{ width: '100%' }}
            options={[
              { value: 'academics', label: 'Academics' },
              { value: 'sports', label: 'Sports' },
              { value: 'arts', label: 'Arts & Culture' },
              { value: 'events', label: 'Events' },
            ]}
          />
          {events.length > 0 && (
            <Select
              placeholder="Assign to event (optional)"
              value={form.eventId || undefined}
              onChange={v => setForm({ ...form, eventId: v })}
              allowClear
              style={{ width: '100%' }}
              options={events.map(e => ({ value: e._id, label: e.title }))}
            />
          )}
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList.slice(-1))}
            beforeUpload={() => false}
            accept="image/jpeg,image/png,image/webp"
            maxCount={1}
          >
            {fileList.length === 0 && (
              <div>
                <PictureOutlined style={{ fontSize: 24 }} />
                <div style={{ marginTop: 8 }}>Select Image</div>
                <div style={{ fontSize: 11, color: '#999' }}>Max 5MB • JPG/PNG/WEBP</div>
              </div>
            )}
          </Upload>
        </Space>
      </Modal>
    </div>
  );
}
