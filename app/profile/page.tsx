import { auth } from '@/app/(auth)/auth'
import { notFound } from "next/navigation"
import { TextList } from "@/components/user/text-list"

export default async function ProfilePage() {
  const session = await auth()
  if (!session || !session?.user || !session?.user?.id) {
    return notFound()
  }

  return (
    <div className="p-6 pt-24">
      <TextList />
    </div>
    
  );
}