import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Switch, Typography, Avatar, Dropdown, theme } from 'antd';
import {
  DashboardOutlined,
  PictureOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  NotificationOutlined,
  RobotOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BulbOutlined,
  LockOutlined,
  TeamOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/events', icon: <CalendarOutlined />, label: 'Events' },
  { key: '/gallery', icon: <PictureOutlined />, label: 'Gallery' },
  { key: '/videos', icon: <VideoCameraOutlined />, label: 'Videos' },
  { key: '/notices', icon: <NotificationOutlined />, label: 'Notices' },
  { key: '/staff', icon: <TeamOutlined />, label: 'Staff' },
  { key: '/enquiries', icon: <FileTextOutlined />, label: 'Enquiries 📋' },
  { key: '/ai-settings', icon: <RobotOutlined />, label: 'AI Settings' },
];

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { admin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { token: themeToken } = theme.useToken();

  const avatarMenuItems = [
    { key: 'password', icon: <LockOutlined />, label: 'Change Password' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
  ];

  const handleAvatarMenu = ({ key }) => {
    if (key === 'logout') logout();
    if (key === 'password') navigate('/change-password');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: isDark ? '#1a1a2e' : '#ffffff',
          borderRight: `1px solid ${isDark ? '#303045' : '#f0f0f0'}`,
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${isDark ? '#303045' : '#f0f0f0'}`,
        }}>
          <Text strong style={{
            fontSize: collapsed ? 14 : 18,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transition: 'all 0.3s',
          }}>
            {collapsed ? 'DA' : 'DAGA Admin'}
          </Text>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
          style={{
            border: 'none',
            background: 'transparent',
            marginTop: 8,
          }}
        />

        <div style={{
          position: 'absolute',
          bottom: 16,
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: '0 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <BulbOutlined style={{ color: isDark ? '#fbbf24' : '#6b7280' }} />
            {!collapsed && <Text style={{ fontSize: 12 }}>{isDark ? 'Dark' : 'Light'}</Text>}
            <Switch
              size="small"
              checked={isDark}
              onChange={toggleTheme}
            />
          </div>
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header style={{
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isDark ? '#1a1a2e' : '#ffffff',
          borderBottom: `1px solid ${isDark ? '#303045' : '#f0f0f0'}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18, cursor: 'pointer', color: themeToken.colorText }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          <Dropdown menu={{ items: avatarMenuItems, onClick: handleAvatarMenu }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Avatar style={{ background: '#4f46e5' }}>
                {admin?.username?.[0]?.toUpperCase() || 'A'}
              </Avatar>
              <Text>{admin?.username}</Text>
            </div>
          </Dropdown>
        </Header>

        <Content style={{
          margin: 24,
          minHeight: 'calc(100vh - 64px - 48px)',
        }}>
          <div className="fade-in">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
