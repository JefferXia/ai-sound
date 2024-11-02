import AudioList from '@/components/audio/list'

export default async function Page() {

  return (
    <div 
      className='flex flex-col px-6'
      style={{ height: 'calc(100vh - 3rem)' }}
    >
      <h2 className='py-3 text-2xl text-main-color font-medium'>编辑精选</h2>
      <AudioList />
    </div>
  );
}
