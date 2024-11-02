export type ReechoResp = {
  /**
   * 创建的异步生成任务详情
   */
  data: any
  /**
   * 状态信息
   */
  message: string
  /**
   * 状态码
   */
  status: number
}

export function ReechoSuccess(status: number): boolean {
  return status === 200
}

/**
 * 任务元数据
 */
export interface DataMetadata {
  /**
   * 最终生成的音频 URL（如有）
   */
  audio?: string
  /**
   * 任务生成的总字符数
   */
  characters: number
  /**
   * 任务包含的内容列表
   */
  contents: TaskContent[]
  /**
   * 是否进行增强处理（已弃用）
   */
  enhance?: boolean
  /**
   * 连贯性增强参数（已弃用）
   */
  framesToKeep?: number
  /**
   * 最终结果生成完毕的时间（如有）
   */
  generatedAt?: Date
  /**
   * 是否为付费用户
   */
  isPremium: boolean
  /**
   * 已重新生成的子内容历史
   */
  regenerates?: Regenerate[]
  /**
   * 多样性参数除以100
   */
  temperature: number
  /**
   * 本次任务消耗的总 token 数量（仅用于内部统计）
   */
  tokens?: number
  /**
   * 与稳定性过滤参数相等
   */
  top_k: number
  /**
   * 概率优选参数除以100
   */
  top_p: number
  /**
   * 任务所使用的语音角色列表
   */
  voices: Voice[]
}

/**
 * 任务内容详情
 */
export type TaskContent = {
  /**
   * 生成的音频 URL
   */
  audio?: string
  /**
   * 生成完成时间
   */
  generatedAt?: Date
  /**
   * 用于生成的文本内容
   */
  text: string
  /**
   * 消耗的 token 数量（仅用于内部统计）
   */
  tokens?: number
  /**
   * 语音角色 ID
   */
  voiceId: string
}

/**
 * 重新生成的子内容详情
 */
export type Regenerate = {
  /**
   * 已重新生成的字符数
   */
  characters: number
  /**
   * 已重新生成的子内容索引数组
   */
  contents: number[]
}

/**
 * 语音角色详情
 *
 * 语音角色，语音角色详情
 */
export type Voice = {
  /**
   * 语音角色 ID
   */
  id: string
  /**
   * 如有请在请求语音生成接口时使用该id
   */
  idForGenerate?: string
  /**
   * 语音角色元数据
   */
  metadata: VoiceMetadata
  /**
   * 语音角色名称
   */
  name: string
  /**
   * 语音角色状态，可以为pending（瞬时克隆已完成）、lora-pending（专业克隆训练中）、lora-success（专业克隆已完成）、lora-failed（专业克隆失败）
   */
  status: VoiceStatus
}

/**
 * 语音角色元数据
 */
export type VoiceMetadata = {
  /**
   * 语音角色头像 URL
   */
  avatar?: string
  /**
   * 语音角色描述
   */
  description?: string
  /**
   * 是否已进行预处理（已弃用）
   */
  preProcess?: boolean
  /**
   * 语音角色风格列表
   */
  prompts: Prompt[]
}

/**
 * 语音角色风格详情
 */
export type Prompt = {
  /**
   * 角色风格 ID
   */
  id: string
  /**
   * 角色风格名称
   */
  name: string
  /**
   * 角色风格样本音频 URL
   */
  promptOriginAudioStorageUrl: string
}

/**
 * 语音角色状态，可以为pending（瞬时克隆已完成）、lora-pending（专业克隆训练中）、lora-success（专业克隆已完成）、lora-failed（专业克隆失败）
 */
export enum VoiceStatus {
  LoraFailed = 'lora-failed',
  LoraPending = 'lora-pending',
  LoraSuccess = 'lora-success',
  Pending = 'pending'
}

/**
 * 异步任务状态，可以是 pending 等待中 / processing 处理中 / generated 已完成 / failed 任务出错
 */
export enum DataStatus {
  Failed = 'failed',
  Generated = 'generated',
  Pending = 'pending',
  Processing = 'processing'
}

/**
 * 任务所使用的模型ID
 */
export enum Type {
  ReechoNeuralVoice001 = 'reecho-neural-voice-001'
}
