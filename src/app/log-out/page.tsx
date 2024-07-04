import Logout from './Logout';
import { keycloakLogout } from '@/util/server-utils';

export default async function LogoutPage() {
  await keycloakLogout();
  return <Logout />;
}
