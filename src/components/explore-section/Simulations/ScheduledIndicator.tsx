import { CalendarOutlined } from '@ant-design/icons';

export default function ScheduledIndicator() {
  return (
    <div className="flex items-center justify-center" style={{ height: 300 }}>
      <div className="flex w-[400px] items-center space-x-4 rounded-md bg-orange-100 p-4 shadow-md">
        <CalendarOutlined className="text-4xl text-orange-500" />

        <div className="text-orange-600">
          <div className="text-lg font-semibold">Scheduled</div>

          <div className="mt-1">
            <p>This analysis has been scheduled to run. </p>

            <p>
              It will begin execution as soon as the simulation campaign is completed and there are
              workers available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
