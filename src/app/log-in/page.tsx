import { Button } from 'antd';
import { GitlabFilled, GithubOutlined, GoogleOutlined } from '@ant-design/icons';

export default function Page({
  searchParams,
}: {
  searchParams: { errorcode: string | undefined };
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-2xl font-bold text-white">Login to your virtual lab</div>
      <div className="flex items-center gap-8">
        <div className="flex h-[124px] w-[124px] items-center justify-center rounded-full bg-white">
          <GoogleOutlined className="text-6xl" />
        </div>
        <div className="flex h-[124px] w-[124px] items-center justify-center rounded-full bg-white">
          <GithubOutlined className="text-6xl" />
        </div>
        <div className="flex h-[124px] w-[124px] items-center justify-center rounded-full bg-white">
          <GitlabFilled className="text-6xl" />
        </div>
      </div>
      <hr className="border-primary-7" />
      <div className="flex items-center justify-between">
        <div className="text-xl text-white">Don't have a lab yet?</div>
        <Button className="rounded-none" ghost>
          Sign-up
        </Button>
      </div>
    </div>
  );
}
