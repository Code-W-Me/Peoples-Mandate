import ElectionDetailsPage from "@/components/ElectionDetailsPage";
import { AddressSchema } from "@repo/shared";

export default async function ElectionPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const _address = (await params).address;

  const parsed = AddressSchema.safeParse(_address);

  if (!parsed.success) return <div>Invalid Election Address</div>;

  const electionAddress = parsed.data;
  return (
    <ElectionDetailsPage
      key={electionAddress}
      electionAddress={electionAddress}
    />
  );
}
