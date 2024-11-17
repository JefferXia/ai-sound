import { cookies } from 'next/headers';
import { CreateText } from '@/components/create/create-text'

export default async function Page() {

  const cookieStore = await cookies();

  return (
    <CreateText />
  );
}
