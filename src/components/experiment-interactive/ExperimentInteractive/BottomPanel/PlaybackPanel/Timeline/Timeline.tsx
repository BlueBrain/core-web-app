import TimeRange from './TimeRange';
import TimeMarkers from './TimeMarkers';
import TimeSlider from './TimeSlider';

export default function Timeline() {
  return (
    <div className="w-8/12">
      <div className="w-full overflow-hidden">
        <div className="flex flex-col pt-1 px-3">
          <TimeMarkers />
          <TimeSlider />
          <TimeRange />
        </div>
      </div>
    </div>
  );
}
