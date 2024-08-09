import type { FC } from 'react';
import { Dashboard, type DashboardData, type DashboardSettings, Undraggable, Widget } from '@talkohavy/dashboard';

enum WidgetTypes {
  Text = 'text',
}

const dashboardSettings: DashboardSettings = {
  dashboard: {
    floatType: 'free-form',
    gapFromWalls: 0,
  },
  grid: {
    alwaysVisible: true,
    rowHeight: 50,
    columnCount: 12,
  },
  widgets: {
    axisHandlerPositions: ['se'],
  },
};

const data: DashboardData<WidgetTypes> = [
  {
    i: 'aaa',
    type: WidgetTypes.Text,
    x: 0,
    y: 0,
    w: 2,
    h: 2,
    props: {},
  },
  {
    i: 'bbb',
    type: WidgetTypes.Text,
    x: 2,
    y: 2,
    w: 3,
    h: 3,
    static: true,
    props: {},
  },
];

const WIDGET_MAPPER: Record<string, FC> = {
  text: () => (
    <div className='size-full bg-red-400'>
      <Undraggable>hello</Undraggable>
    </div>
  ),
};

export default function HomePage() {
  return (
    <div className='size-full p-6'>
      <div>Main</div>
      <div>window</div>

      <Dashboard settings={dashboardSettings} data={data}>
        {data.map(({ i: widgetId, type, props }) => (
          <div key={widgetId}>
            <Widget axisHandlerPositions={dashboardSettings.widgets?.axisHandlerPositions} className='bg-red-600'>
              {WIDGET_MAPPER[type]?.({ ...props })}
            </Widget>
          </div>
        ))}
      </Dashboard>
    </div>
  );
}
