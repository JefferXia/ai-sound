'use client';

import { useEffect, useState } from 'react';
import {
  ChevronRight,
  Clock,
  FileText,
  History,
  Package,
  AlertCircle,
} from 'lucide-react';
import Markdown from 'markdown-to-jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductItem {
  id: string;
  product_name: string;
  product_url: string;
  image_caption: string;
  report: string;
  createdAt: string;
  status?: 'SUCCESS' | 'PENDING' | 'PROCESSING' | 'CANCELLED';
}

function LoadingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-full">
        {/* 左侧加载骨架 */}
        <div className="flex h-[100vh] w-96 flex-col border-r border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-7 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
          <div className="border-b border-border p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
              <div className="text-center">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <Skeleton className="h-4 w-20 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* 右侧加载骨架 */}
        <div className="h-[100vh] flex-1 bg-background pb-6">
          <div className="flex h-full justify-center items-center overflow-y-auto">
            <div className="w-2/3 max-w-4xl pt-6">
              <Skeleton className="h-[80vh] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const historyResponse = await fetch('/api/history');

        if (!historyResponse.ok) {
          throw new Error(`HTTP error! status: ${historyResponse.status}`);
        }

        const result = await historyResponse.json();

        if (result.success && result.data && Array.isArray(result.data)) {
          // 直接使用数据库中的状态，不需要额外处理
          setProductItems(result.data);

          // 默认选择第一个商品
          const firstItem = result.data[0];
          if (firstItem) {
            setSelectedProduct(firstItem);
          }
        } else {
          setProductItems([]);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        setError('加载数据失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return {
          text: '已完成',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          variant: 'default' as const,
        };
      case 'PROCESSING':
        return {
          text: '处理中',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          variant: 'secondary' as const,
        };
      case 'PENDING':
        return {
          text: '排队中',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          variant: 'outline' as const,
        };
      default:
        return {
          text: '未知',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          variant: 'outline' as const,
        };
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="mb-2 text-lg font-medium">加载失败</h3>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>重新加载</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-full">
        {/* 左侧商品列表 */}
        <div className="flex h-[100vh] w-96 flex-col border-r border-border bg-card">
          {/* 页面标题 */}
          <div className="border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <History className="h-7 w-7 text-primary" />
              <div>
                <h1 className="text-xl font-bold">检测历史记录</h1>
                <p className="text-sm text-muted-foreground">
                  查看您的商品检测记录和报告
                </p>
              </div>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="border-b border-border p-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {
                    productItems.filter((item) => item.status === 'SUCCESS')
                      .length
                  }
                </div>
                <div className="text-xs text-muted-foreground">已完成</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {
                    productItems.filter((item) => item.status === 'PROCESSING')
                      .length
                  }
                </div>
                <div className="text-xs text-muted-foreground">处理中</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">
                  {
                    productItems.filter((item) => item.status === 'PENDING')
                      .length
                  }
                </div>
                <div className="text-xs text-muted-foreground">排队中</div>
              </div>
            </div>
          </div>

          {/* 商品列表 */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="mb-3 text-sm font-medium">商品列表</h3>
              {productItems.length === 0 ? (
                <div className="py-8 text-center">
                  <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">暂无检测记录</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {productItems.map((item) => {
                    const statusInfo = getStatusInfo(
                      item.status || 'PROCESSING'
                    );
                    const isSelected = selectedProduct?.id === item.id;

                    return (
                      <Card
                        key={item.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'hover:border-border/80 hover:shadow-sm'
                        }`}
                        onClick={() => setSelectedProduct(item)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0">
                              <Package
                                className={`h-4 w-4 ${
                                  isSelected
                                    ? 'text-primary'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between">
                                <h4
                                  className={`line-clamp-2 text-sm font-medium leading-5 ${
                                    isSelected
                                      ? 'text-primary'
                                      : 'text-foreground'
                                  }`}
                                >
                                  {item.product_name}
                                </h4>
                                <ChevronRight
                                  className={`ml-2 h-4 w-4 flex-shrink-0 ${
                                    isSelected
                                      ? 'text-primary'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              </div>
                              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                {item.image_caption || '查看详情'}
                              </p>
                              <div className="mt-2 flex items-center justify-between">
                                <Badge
                                  variant={statusInfo.variant}
                                  className={`text-xs ${
                                    item.status === 'SUCCESS'
                                      ? 'bg-green-100 text-green-700'
                                      : item.status === 'PROCESSING'
                                        ? 'bg-blue-100 text-blue-700'
                                        : item.status === 'PENDING'
                                          ? 'bg-yellow-100 text-yellow-700'
                                          : item.status === 'CANCELLED'
                                            ? 'bg-red-100 text-red-700'
                                            : ''
                                  }`}
                                >
                                  {statusInfo.text}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {item.createdAt}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧报告区域 */}
        <div className="h-[100vh] flex-1 bg-background pb-6">
          <div className="flex h-full justify-center overflow-y-auto">
            {selectedProduct ? (
              <div className="w-2/3 max-w-4xl pt-6">
                {selectedProduct.status === 'SUCCESS' &&
                selectedProduct.report ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded bg-blue-100 dark:bg-blue-900/20 mr-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <CardTitle>检测报告</CardTitle>
                          <p className="mt-2 text-sm text-muted-foreground">
                            <a
                              href={selectedProduct.product_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-500 hover:underline"
                            >
                              {selectedProduct.product_name}
                            </a>
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* <div className="prose prose-sm max-w-none dark:prose-invert">
                        <Markdown>{selectedProduct.report}</Markdown>
                      </div> */}
                      <div className="markdown-content text-sm">
                        <Markdown
                          options={{
                            forceBlock: true, // 让解析更接近 GFM
                          }}
                        >
                          {selectedProduct.report}
                        </Markdown>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex min-h-full items-center justify-center">
                    <Card className="w-96">
                      <CardContent className="pt-6">
                        <div className="py-12 text-center">
                          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                            <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <h3 className="mb-2 text-lg font-medium">
                            {selectedProduct.status === 'PROCESSING'
                              ? '报告生成中'
                              : '等待处理'}
                          </h3>
                          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                            {selectedProduct.status === 'PROCESSING'
                              ? '正在分析商品信息，预计1-3分钟完成'
                              : '商品检测请求已提交，等待系统处理'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full w-1/2 max-w-4xl overflow-y-auto p-6">
                <div className="flex min-h-full items-center justify-center">
                  <Card className="w-96">
                    <CardContent className="pt-6">
                      <div className="py-12 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium">
                          选择商品查看报告
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          从左侧列表中选择一个商品以查看详细的检测报告
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
