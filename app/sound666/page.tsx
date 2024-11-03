import { cookies } from 'next/headers';
import { AudioCreate } from '@/components/audio/create'

import { DEFAULT_MODEL_NAME, models } from '@/ai/models';

export default async function Page() {

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('model-id')?.value;

  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  return (
    <AudioCreate />
  );
}
