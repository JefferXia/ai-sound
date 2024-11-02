import { DataMetadata, DataStatus, Type } from '@/lib/ai/reecho/common'

export type AsyncGenerateTTSReq = {
  /**
   * 增强文本情感（实验性，默认为true）
   */
  break_clone?: boolean
  /**
   * 要生成的内容列表
   */
  contents: Content[]
  /**
   * 读音字典，格式为：["音素", [["y", "in1"],["s" "u4"]]]]
   */
  dictionary?: { [key: string]: any }[]
  /**
   * 低延迟模式（默认为false）
   */
  flash?: boolean
  /**
   * [已弃用]要使用的模型ID (目前默认统一为reecho-neural-voice-001)
   */
  model?: Model
  /**
   * 概率优选（0-100，默认为93）
   */
  probability_optimization?: number
  /**
   * 多样性 (0-100，默认为98)
   */
  randomness?: number
  /**
   * 生成种子，最大为Int32，-1或null时为随机（默认为-1）
   */
  seed?: number | null
  /**
   * 音质增强（实验性，默认为false）
   */
  sharpen?: boolean
  /**
   * 是否启用字幕生成（与低延迟模式不兼容，默认为false）
   */
  srt?: boolean
  /**
   * 稳定性过滤 (0-1024，默认为256)
   */
  stability_boost?: number
  /**
   * 是否启用流式生成（默认为false)
   */
  stream?: boolean
}

export type Content = {
  /**
   * 角色风格 ID（默认为default)
   */
  promptId?: string
  /**
   * 要生成的文本内容
   */
  text: string
  /**
   * 语音角色 ID
   */
  voiceId: string
}

/**
 * [已弃用]要使用的模型ID (目前默认统一为reecho-neural-voice-001)
 */
export enum Model {
  ReechoNeuroVoice001 = 'reecho-neuro-voice-001'
}

/**
 * 创建的异步生成任务详情
 *
 * 生成任务，异步生成任务详情
 */
export type AsyncGenerateTTSResp = {
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

export const DefaultAsyncGenerateTTSReq: AsyncGenerateTTSReq = {
  contents: [],
  randomness: 98,
  stability_boost: 256,
  probability_optimization: 93,
  break_clone: true,
  sharpen: false,
  flash: false,
  stream: false,
  srt: false,
  seed: -1,
  dictionary: [{}]
}
