import { redirect } from 'next/navigation';

import { PromptKeeperWorkspace } from '@/components/promptkeeper/PromptKeeperWorkspace';
import { auth } from '@/app/(auth)/auth';

export default async function PromptPage() {
  const session = await auth();

  // if (!session?.user?.id) {
  //   redirect('/login')
  // }

  return (
    <div className="">
      <PromptKeeperWorkspace />
    </div>
  );
}
