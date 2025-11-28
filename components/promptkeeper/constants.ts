import { NoteColor, PromptMarketplaceCategory } from '@/types/promptKeeper'

export const OFFICE_COLORS = [
  { name: 'Default', value: NoteColor.Default, border: 'border-gray-200' },
  { name: 'Red', value: NoteColor.Red, border: 'border-red-200' },
  { name: 'Orange', value: NoteColor.Orange, border: 'border-orange-200' },
  { name: 'Yellow', value: NoteColor.Yellow, border: 'border-yellow-200' },
  { name: 'Green', value: NoteColor.Green, border: 'border-green-200' },
  { name: 'Teal', value: NoteColor.Teal, border: 'border-teal-200' },
  { name: 'Blue', value: NoteColor.Blue, border: 'border-blue-200' },
  { name: 'Purple', value: NoteColor.Purple, border: 'border-purple-200' },
]

export const PROMPT_MARKETPLACE_CATEGORIES: PromptMarketplaceCategory[] = [
  {
    id: 'cat_coding',
    name: 'Coding & Development',
    description: 'Debugging、架构设计、代码生成的一线实战提示词合集。',
    coverImage: 'https://picsum.photos/800/400?random=111',
    examplePrompt: `Act as a Senior Frontend Engineer and Tech Lead.

Your task is to refactor a legacy React class component into a functional component using Hooks.
The component is complex and handles several responsibilities:
1. Fetches user data from an API endpoint (/api/user/profile).
2. Manages form state for a profile update with validation.
3. Handles WebSocket connections for real-time notifications.

Constraints & Requirements:
- Use React.useEffect for side effects (API calls, WebSocket subscriptions).
- Use custom hooks to separate logic (e.g., useUserData, useForm, useWebSocket).
- Implement proper error handling and loading states.
- Ensure type safety using TypeScript interfaces.
- Optimize for performance using useMemo and useCallback where appropriate.
- Follow the "Container/Presenter" pattern or simpler "Component Composition" if appropriate.
- Do not use any external state management libraries like Redux; use React Context if absolutely necessary, but local state is preferred.

Here is the structure of the legacy code you need to replace:
class UserProfile extends React.Component {
  componentDidMount() {
    // fetching data...
  }
  handleInputChange = (e) => {
    // state updates...
  }
  // ... 200 lines of code ...
}

Please provide:
1. The full refactored code in TypeScript.
2. A brief explanation of the architectural decisions made.
3. Potential edge cases to watch out for during migration.`,
    isPremium: false,
  },
  {
    id: 'cat_writing',
    name: 'Creative Writing',
    description: '故事线、人物塑造、长篇推理等创作灵感的写作工具包。',
    coverImage: 'https://picsum.photos/800/400?random=222',
    examplePrompt: `Act as a best-selling fiction author and creative writing coach.

I need you to write a gripping opening scene for a Mystery/Thriller novel.
The setting is a crowded subway station in Tokyo during rush hour, but the protagonist notices something completely out of place that no one else sees.

Key Elements to Include:
1. Atmosphere: Describe the sensory details—the humidity, the noise of the trains, the smell of ozone and damp clothes.
2. The "Glitch": The protagonist sees a man standing perfectly still in the chaotic crowd, holding an object that shouldn't exist in this timeline (e.g., a Victorian-era lantern that glows with cold blue light).
3. Internal Monologue: The protagonist's reaction should shift from confusion to primal fear.
4. Pacing: Start with a fast, chaotic rhythm matching the crowd, then suddenly slow down time when the protagonist locks eyes with the stranger.

Tone: Noir, gritty, and slightly supernatural.
Word Count: Approximately 400-600 words.

After writing the scene, provide 3 potential plot hooks that could follow this opening.`,
    isPremium: false,
  },
  {
    id: 'cat_marketing_pro',
    name: 'Marketing Masterclass (VIP)',
    description: '高转化文案、SEO 策略、渠道运营一体化提示词。',
    coverImage: 'https://picsum.photos/800/400?random=333',
    examplePrompt: `Act as a Chief Marketing Officer (CMO) with 20 years of experience in B2B SaaS.

Develop a comprehensive 3-month Go-To-Market (GTM) strategy for a new project management tool designed specifically for remote-first creative agencies.

The strategy must include the following sections:

1. Target Audience Persona: Define the ideal customer profile (ICP) including pain points (e.g., version control chaos, missed deadlines) and goals.
2. Value Proposition Canvas: Clearly articulate the USP (Unique Selling Proposition). Why us instead of Asana or Trello?
3. Content Marketing Strategy:
   - List 5 high-intent blog post titles targeting bottom-of-funnel keywords.
   - Outline a "Lead Magnet" (e.g., a whitepaper or template) to capture emails.
4. Cold Outreach Plan:
   - Write a 3-step email sequence for cold outreach to Agency Founders.
   - Email 1: The Hook (Problem focused)
   - Email 2: The Solution (Value focused)
   - Email 3: The Break-up (Urgency focused)
5. Key Performance Indicators (KPIs): List the top 5 metrics we should track to measure success (e.g., CAC, LTV, MQLs).

Format the output as a professional strategic document suitable for presentation to a Board of Directors.`,
    isPremium: true,
    price: 9.99,
  },
  {
    id: 'cat_midjourney',
    name: 'Midjourney Art Styles (VIP)',
    description: '适配多种风格与参数的高级视觉提示词模版。',
    coverImage: 'https://picsum.photos/800/400?random=444',
    examplePrompt: `Create a series of 5 distinct prompt variations for Midjourney v6 to generate a "Cyberpunk Street Food Vendor".

Each variation should explore a different artistic style and camera angle.

Variation 1: Photorealistic Cinematic
Parameters: --ar 16:9 --v 6.0 --style raw --stylize 250
Keywords: 35mm lens, f/1.8, neon rain, bokeh, steam rising, hyper-detailed textures, wet pavement reflections.

Variation 2: Anime / Studio Ghibli Style
Parameters: --ar 16:9 --niji 6
Keywords: Hand-painted backgrounds, vibrant colors, delicious looking food, cozy atmosphere, soft lighting, cel shading.

Variation 3: Isometric 3D Render
Parameters: --ar 1:1 --v 6.0 --tile
Keywords: Blender 3D, Octane render, clay material, miniature world, cute lighting, pastel neon palette, isometric view.

Variation 4: Retro 80s Synthwave Illustration
Parameters: --ar 3:4 --v 6.0
Keywords: Airbrush art, grainy texture, magenta and cyan palette, wireframe grids in background, VHS glitch effect.

Variation 5: Charcoal & Ink Sketch
Parameters: --ar 16:9 --v 6.0 --monochrome
Keywords: Rough sketch, charcoal lines, ink splatters, moody shadows, high contrast, noir atmosphere.

For each variation, explain briefly why these specific parameters were chosen.`,
    isPremium: true,
    price: 14.99,
  },
]

