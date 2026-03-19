import { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import api from '../api/axios.js';

const { Title } = Typography;

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      return message.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Password updated successfully!');
      form.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>Change Password</Title>
      <Card style={{ maxWidth: 480, borderRadius: 12 }}>
        <Form form={form} layout="vertical" onFinish={onFinish} size="large">
          <Form.Item name="currentPassword" label="Current Password"
            rules={[{ required: true, message: 'Required' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Enter current password" />
          </Form.Item>
          <Form.Item name="newPassword" label="New Password"
            rules={[{ required: true, message: 'Required' }, { min: 6, message: 'Min 6 characters' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Confirm New Password"
            rules={[{ required: true, message: 'Required' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', borderRadius: 8 }}>
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
