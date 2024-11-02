import { createApiClient } from '@/services/api/client'
import { API_CONFIG } from '@/services/config/constants'
import { API_ENDPOINTS } from '@/services/config/endpoints'

const sevenThetaClient = createApiClient(API_CONFIG.SEVEN_THETA_API_URL)

export const sevenThetaService = {
  webTextScrape: async (
    requestId: string,
    url: string
  ): Promise<WebTextScrapResp> => {
    sevenThetaClient.interceptors.request.use()
    try {
      const startTime = Date.now()
      const response = await sevenThetaClient.post(
        API_ENDPOINTS.SEVEN_THETA.WEB_TEXT_SCRAPE,
        {
          url: url
        }
      )
      const duration = Date.now() - startTime
      console.log(
        `sevenThetaService.webTextScrape: requestId: ${requestId} duration: ${duration}ms, req: ${url}, resp: ${JSON.stringify(response.data)}`
      )
      return response.data
    } catch (e) {
      console.error(`sevenThetaService.webTextScrape: error: ${e}`)
      throw e
    }
  }
}
