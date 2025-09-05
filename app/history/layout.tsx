import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '检测历史记录 - 极效火眼',
  description: '查看您的商品检测记录和报告',
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
