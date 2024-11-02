import { DataMetadata, DataStatus, Type } from '@/lib/ai/reecho/common'

export type GetTTSStatusResp = {
  /**
   * 异步生成任务 ID
   */
  id: string
  /**
   * 任务元数据
   */
  metadata: DataMetadata
  /**
   * 异步任务状态，可以是 pending 等待中 / processing 处理中 / generated 已完成 / failed 任务出错
   */
  status: DataStatus
  /**
   * 任务所使用的模型ID
   */
  type: Type
  /**
   * 创建任务的用户 ID
   */
  userId: string
}
