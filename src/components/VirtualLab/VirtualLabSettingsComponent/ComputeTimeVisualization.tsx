'use client';

type Props = {
  totalTimeInHours: number;
  usedTimeInHours: number;
};

const getDimensionsForUsage = (usedTime: number, totalTime: number) => {
  // The following `NORMAL_USAGE_RATIO` and `NORMAL_USAGE_RATIO` constants are (for now) dummy values that represent the upper limit as a ratio of usedTime to totalTime.
  const NORMAL_USAGE_RATIO = 0.7;
  const WARNING_USAGE_RATIO = 0.9;

  const warningUsageRange = WARNING_USAGE_RATIO - NORMAL_USAGE_RATIO;
  const criticalUsageRange = 1 - WARNING_USAGE_RATIO;

  const usage = usedTime / totalTime;

  const normalUsagePercent = Math.min(usage, NORMAL_USAGE_RATIO) * 100;

  const timeOverNormal = usage > NORMAL_USAGE_RATIO ? usage - NORMAL_USAGE_RATIO : 0;
  const warningUsagePercent = timeOverNormal
    ? Math.min(timeOverNormal, warningUsageRange) * 100
    : 0;

  const timeOverWarning = usage > WARNING_USAGE_RATIO ? usage - WARNING_USAGE_RATIO : 0;
  const criticalUsagePercent = timeOverWarning
    ? Math.min(timeOverWarning, criticalUsageRange) * 100
    : 0;

  return {
    normal: normalUsagePercent.toFixed(0),
    warning: warningUsagePercent ? warningUsagePercent.toFixed(0) : null,
    critical: criticalUsagePercent ? criticalUsagePercent.toFixed(0) : null,
  };
};

export default function ComputeTimeVisualization({ totalTimeInHours, usedTimeInHours }: Props) {
  const usageToDimensionsMap = getDimensionsForUsage(usedTimeInHours, totalTimeInHours);

  return (
    <>
      <div
        className="my-3 flex h-6 w-full overflow-x-hidden rounded-xl bg-primary-7"
        data-testid="viz-bar-container"
        title={`Used time: ${usedTimeInHours} | Available time: ${totalTimeInHours}`}
      >
        <div
          style={{ width: `${usageToDimensionsMap.normal}%`, background: '#91D5FF' }}
          data-testid="normal-time-viz-bar"
        />
        {usageToDimensionsMap.warning && (
          <div
            style={{ width: `${usageToDimensionsMap.warning}%`, background: '#EFF255' }}
            data-testid="warning-usage-time-viz-bar"
          />
        )}
        {usageToDimensionsMap.critical && (
          <div
            style={{ width: `${usageToDimensionsMap.critical}%`, background: '#FF4D4F' }}
            data-testid="critical-usage-time-viz-bar"
          />
        )}
      </div>

      <div className="m-auto w-max rounded-[32px] border border-primary-7 px-7 py-2 font-bold text-primary-2">
        {usedTimeInHours < totalTimeInHours
          ? `${totalTimeInHours - usedTimeInHours} ${
              totalTimeInHours - usedTimeInHours === 1 ? 'hour' : 'hours'
            } left`
          : 'No usage hours left'}
      </div>
    </>
  );
}
