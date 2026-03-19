import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin } from 'antd';
import { PictureOutlined, CalendarOutlined, VideoCameraOutlined, NotificationOutlined } from '@ant-design/icons';
import api from '../api/axios.js';

const { Title } = Typography;

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [gallery, events, videos, notices] = await Promise.all([
          api.get('/gallery?limit=1'),
          api.get('/events'),
          api.get('/videos'),
          api.get('/notices'),
        ]);
        setStats({
          photos: gallery.data.pagination?.total || 0,
          events: events.data.length || 0,
          videos: videos.data.length || 0,
          notices: notices.data.length || 0,
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
        setStats({ photos: 0, events: 0, videos: 0, notices: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: 100 }}><Spin size="large" /></div>;

  const cards = [
    { title: 'Total Photos', value: stats.photos, icon: <PictureOutlined />, color: '#4f46e5' },
    { title: 'Events', value: stats.events, icon: <CalendarOutlined />, color: '#059669' },
    { title: 'Videos', value: stats.videos, icon: <VideoCameraOutlined />, color: '#d97706' },
    { title: 'Active Notices', value: stats.notices, icon: <NotificationOutlined />, color: '#dc2626' },
  ];

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <Row gutter={[24, 24]}>
        {cards.map(item => (
          <Col xs={24} sm={12} lg={6} key={item.title}>
            <Card hoverable style={{ borderRadius: 12, borderLeft: `4px solid ${item.color}` }}>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={<span style={{ color: item.color, fontSize: 24, marginRight: 8 }}>{item.icon}</span>}
                valueStyle={{ fontSize: 28, fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
