import AudioList from '@/components/audio/list'

export default async function Page() {

  return (
    <div 
      className='flex flex-col px-6'
      style={{ height: 'calc(100vh - 3rem)' }}
    >
      <h2 className='py-3 text-2xl font-medium'>八度空间</h2>
      <AudioList />
    </div>
  );
}
