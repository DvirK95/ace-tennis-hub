import { network } from '@/lib/axios';

async function login() {
  const res = await network.post('/auth/Login', {
    email: 'test@test.com',
    password: '123456',
  });
  return res.data;
}
export const authApi = {
  login,
};
