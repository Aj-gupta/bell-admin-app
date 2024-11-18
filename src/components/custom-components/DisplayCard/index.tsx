import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  title: string;
  value: string;
}

export default function DisplayCard({ title, value }: Props) {
  return (
    <Card className="w-36 px-2 py-2 rounded-lg flex flex-col justify-between items-center">
      <h1 className="text-xs font-normal text-slate-400">{title}</h1>
      <div className="mt-2"/>
      <h2 className="text-xs font-semibold">{value}</h2>
    </Card>
  );
}
