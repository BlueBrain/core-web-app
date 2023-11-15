import { cleanup, render, screen } from '@testing-library/react';
import ComputeTimeVisualization from './ComputeTimeVisualization';

describe('ComputeTimeVisualization', () => {
  it('shows only blue bar when usage is within normal usage limit', () => {
    renderComponent({ usedTime: 50, totalTime: 100 });

    const normalUsageBarElement = normalUsageBar();
    expect(getComputedStyle(normalUsageBarElement).width).toEqual('50%');
    expect(getComputedStyle(normalUsageBarElement).background).toEqual('rgb(145, 213, 255)');

    expect(warningUsageBar()).not.toBeInTheDocument();
    expect(criticalUsageBar()).not.toBeInTheDocument();
  });

  it('shows warning bar when usage is withing warning limits', () => {
    renderComponent({ usedTime: 85, totalTime: 100 });
    expect(normalUsageBar()).toBeVisible();

    const warningUsageBarElement = warningUsageBar();
    expect(warningUsageBarElement).toBeVisible();
    expect(getComputedStyle(warningUsageBarElement!).width).toEqual('15%');
    expect(getComputedStyle(warningUsageBarElement!).background).toEqual('rgb(239, 242, 85)');

    expect(criticalUsageBar()).not.toBeInTheDocument();
  });

  it('shows all bars when usage is over the warning limit', () => {
    renderComponent({ usedTime: 95, totalTime: 100 });
    expect(normalUsageBar()).toBeVisible();
    expect(warningUsageBar()).toBeVisible();

    const criticalUsageBarElement = criticalUsageBar();
    expect(criticalUsageBarElement).toBeVisible();
    expect(getComputedStyle(criticalUsageBarElement!).width).toEqual('5%');
    expect(getComputedStyle(criticalUsageBarElement!).background).toEqual('rgb(255, 77, 79)');
  });

  it('shows usage hours left', () => {
    renderComponent({ usedTime: 95, totalTime: 100 });
    screen.getByText('5 hours left');

    renderComponent({ usedTime: 0, totalTime: 100 });
    screen.getByText('100 hours left');

    renderComponent({ usedTime: 0.2, totalTime: 100 });
    screen.getByText('99.8 hours left');

    renderComponent({ usedTime: 40, totalTime: 40 });
    screen.getByText('No usage hours left');

    renderComponent({ usedTime: 67, totalTime: 40 });
    screen.getByText('No usage hours left');
  });

  const normalUsageBar = () => screen.getByTestId('normal-time-viz-bar');
  const warningUsageBar = () => screen.queryByTestId('warning-usage-time-viz-bar');
  const criticalUsageBar = () => screen.queryByTestId('critical-usage-time-viz-bar');

  const renderComponent = ({ usedTime, totalTime }: { usedTime: number; totalTime: number }) => {
    cleanup();
    render(<ComputeTimeVisualization totalTimeInHours={totalTime} usedTimeInHours={usedTime} />);
  };
});
