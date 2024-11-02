import { PromptLayer } from 'promptlayer'

const promptLayerClient = new PromptLayer({
  apiKey: process.env.PROMPTLAYER_API_KEY
})

export default promptLayerClient
