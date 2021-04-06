import React from 'react';
import {
  act,
  render,
  screen,
} from '@testing-library/react';

import StatusBar from '../';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));

test('loads and displays StatusBar', () => {
  const ref = React.createRef();

  render(
    <StatusBar
      packetErrors={0}
      ref={ref}
      version="version"
    />
  );

  expect(screen.getByText(/statusbarPortUtilization/i)).toBeInTheDocument();
  expect(screen.getByText(/statusbarPacketError 0/i)).toBeInTheDocument();
  expect(screen.getByText('version')).toBeInTheDocument();

  act(()=> {
    ref.current.updateBatteryState({
      cellCount: 1,
      voltage: 4.2,
    });
  });
  expect(screen.getByText('battery 1S @ 4.2V')).toBeInTheDocument();

  act(()=> {
    ref.current.updateBatteryState({
      cellCount: 1,
      voltage: 3.5,
    });
  });
  expect(screen.getByText('battery 1S @ 3.5V')).toBeInTheDocument();

  act(()=> {
    ref.current.updateBatteryState(null);
  });
  expect(screen.queryByText(/battery/i)).not.toBeInTheDocument();

  act(()=> {
    ref.current.updateUtilization({
      up: 10,
      down: 20,
    });
  });
  expect(screen.getByText('statusbarPortUtilization D: 20% U: 10%')).toBeInTheDocument();
});
