import { EditOutlined } from '@ant-design/icons';

export default function VirtualLabHomePage() {
  return (
    <div className="mt-10 bg-primary-8 p-8">
      <div className="flex flex-row justify-between">
        <div className="max-w-[50%]">
          <div className="text-primary-2">Virtual Lab name</div>
          <h2 className="text-4xl font-bold">Institute of Neuroscience</h2>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tempor enim nec
            condimentum varius. Suspendisse quis sem efficitur, lacinia enim eu, facilisis leo.
            Aliquam ex arcu, aliquet et sagittis ac, imperdiet a diam. Fusce sodales, sapien ut
            mollis faucibus, nisi ex fringilla tellus, eu sagittis ipsum neque eu justo. Suspendisse
            potenti. Mauris a pellentesque arcu. Ut accumsan viverra nibh, vel condimentum ipsum
            semper quis. In venenatis vel nulla ut tempor. Mauris libero mi, mattis eget iaculis ac,
            vulputate id augue. Sed ullamcorper, erat ut euismod congue, lorem diam volutpat lectus,
            id tempus mi diam nec est. Aenean eu libero a.
          </div>
        </div>
        <div>
          <EditOutlined />
        </div>
      </div>
    </div>
  );
}
