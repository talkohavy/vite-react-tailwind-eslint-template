type SceneProps = {
  badge: string;
  title: string;
  children: React.ReactNode;
};

export default function Scene(props: SceneProps) {
  const { badge, title, children } = props;

  return (
    <div className='border rounded-xl overflow-hidden shrink-0'>
      <div className='flex items-center gap-3 px-4 py-3 border-b bg-gray-50 dark:bg-gray-800/60'>
        <span className='text-xs font-bold tracking-widest uppercase text-gray-400'>{badge}</span>

        <span className='font-semibold text-base'>{title}</span>
      </div>

      <div className='flex flex-col gap-2 p-4'>{children}</div>
    </div>
  );
}
