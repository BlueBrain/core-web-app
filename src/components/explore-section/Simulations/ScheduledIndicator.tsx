import { CalendarOutlined } from '@ant-design/icons';

export default function ScheduledIndicator() {
  return (
    <div className="flex justify-center items-center" style={{ height: 300 }}>
      <div className="flex items-center space-x-4 bg-orange-100 p-4 rounded-md shadow-md w-[400px]">
        <CalendarOutlined className="text-orange-500 text-4xl" />

        <div className="text-orange-600">
          <div className="font-semibold text-lg">Scheduled</div>

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
