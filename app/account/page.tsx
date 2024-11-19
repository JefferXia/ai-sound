import { accountDetails } from "@/lib/db"
import { auth } from '@/app/(auth)/auth'
import { notFound } from "next/navigation"
import { AccountInfo } from "@/components/user/account-info"
import { AccountList } from "@/components/user/account-list"

export default async function AccountPage() {
  const session = await auth()
  if (!session || !session?.user || !session?.user?.id) {
    return notFound()
  }

  const { info, records } = await accountDetails(session.user.id)
  return (
    <div className="p-6 pt-24">
      <AccountInfo accountInfo={info} />
      <AccountList list={records} />
    </div>
    
  );
}