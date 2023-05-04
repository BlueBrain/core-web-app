export default function CampaignVideo({ campaignVideo }: { campaignVideo: string }) {
  return (
    <div className="h-full basis-1/4 border-solid border-2">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video className="w-full h-full" autoPlay loop style={{ width: '100', height: '100' }}>
        <source src={campaignVideo} />
      </video>
    </div>
  );
}
