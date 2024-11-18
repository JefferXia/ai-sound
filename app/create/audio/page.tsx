import { CreateAudio } from '@/components/create/create-audio'
import { MinimaxVoiceMap } from '@/lib/config'

export default async function Page() {

  return (
    <CreateAudio audioConfig={MinimaxVoiceMap} />
  );
}
