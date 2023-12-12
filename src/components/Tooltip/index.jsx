import { Arrow, Content, Portal, Provider, Root, Trigger } from '@radix-ui/react-tooltip';

export default function Tooltip({ content, children }) {
  return (
    <Provider delayDuration={600} skipDelayDuration={2000}>
      <Root>
        <Trigger asChild>{children}</Trigger>

        <Portal>
          <Content
            className='z-10 max-w-lg rounded border border-black bg-white p-2 data-[side=bottom]:animate-slide-down data-[side=top]:animate-slide-up'
            sideOffset={5}
          >
            {content}
            <Arrow className='fill-gray-600' />
          </Content>
        </Portal>
      </Root>
    </Provider>
  );
}
