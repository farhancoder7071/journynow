import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  isAdmin?: boolean;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
}

export function StatsCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  isAdmin = false,
  trend,
}: StatsCardProps) {
  return (
    <Card className={`${isAdmin ? 'bg-[#334155] text-white' : 'bg-white'} overflow-hidden shadow-sm`}>
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${iconBgColor}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <div className={`text-sm font-medium ${isAdmin ? 'text-gray-300' : 'text-gray-500'} truncate`}>{title}</div>
            <div className={`text-2xl font-semibold ${isAdmin ? 'text-white' : 'text-gray-900'}`}>{value}</div>
          </div>
        </div>
        {trend && (
          <div className="mt-2 flex items-center text-sm">
            <span className={`flex items-center ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <span className="material-icons text-sm mr-1">
                {trend.isPositive ? 'arrow_upward' : 'arrow_downward'}
              </span>
              {trend.value}
            </span>
            <span className={`ml-2 ${isAdmin ? 'text-gray-400' : 'text-gray-500'}`}>{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
