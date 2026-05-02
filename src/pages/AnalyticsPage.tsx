import { useEffect, useState } from "react";
import api from "@/api/api";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AlignCenterHorizontal, BookOpen, CalendarSync, CodeXml, LoaderCircle, Notebook, Palette, Pencil, ScissorsLineDashed, Timer } from "lucide-react";

type WeeklyFocus = {
  date: string;
  totalFocus: number;
  sessions: number;
};

const chartConfig = {
  totalFocus: {
    label: "Focus Time",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const AnalyticsPage = () => {
  const [chartData, setChartData] = useState<WeeklyFocus[]>([]);
  const [baseInfo, setBaseInfo] = useState<any>(null)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchWeeklyFocus = async () => {
      try {
        setLoading(true)
        const res = await api.get("/analytics/weekly-focus");
        setChartData(res.data);
      }catch (err) {
        console.log(err);
      }finally{
        setLoading(false)
      }
    };

    const fetchBaseInfo = async () => {
      try{
        setLoading(true)
        const res = await api.get("/analytics/base-info")
        setBaseInfo(res.data)
      }catch(err){
        console.log(err);
      }finally{
        setLoading(false)
      }
    }

    fetchBaseInfo()

    fetchWeeklyFocus();
  }, []);

    const formatDuration = (seconds?: number) => {
        if (!seconds) return "0m";

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "code":
            return (
                <>
                <CodeXml size={20} /> 
                </>
            );
            case "write":
            return (
                <>
                <Pencil size={20} /> 
                </>
            );
            case "craft":
            return (
                <>
                <ScissorsLineDashed size={20} /> 
                </>
            );
            case "study":
            return (
                <>
                <Notebook size={20} /> 
                </>
            );
            case "read":
            return (
                <>
                <BookOpen size={20} />
                </>
            );
            case "paint":
            return (
                <>
                <Palette size={20} />
                </>
            );
            default:
            return category;
        }
    };

    if (loading) return <div className="w-full h-full flex items-center justify-center"><LoaderCircle className="animate-spin" /></div>;

    return (
        <div className="container  flex flex-col items-start gap-9 mx-auto">

        <div className="w-full flex flex-col items-start gap-3">
            <div>
                <CardTitle>Quick insights</CardTitle>
                <CardDescription> Key metrics from your recent sessions. A snapshot of your overall focus performance.</CardDescription>
            </div>
            <div className="w-full flex flex-col sm:flex-row items-start gap-4 h-fit">
                <Card className="w-full sm:w-1/3 bg-linear-to-b from-card to-blue-500/10 from-30%">
                    <CardHeader>
                        <CardTitle>Total focus</CardTitle>
                        <CardAction><Timer size={20}/></CardAction>
                    </CardHeader>
                    <CardContent>
                        <h1 className="text-xl font-medium"> {formatDuration(baseInfo?.totalFocusTime)}</h1>
                    </CardContent>
                    
                </Card>
                <Card className="w-full sm:w-1/3 bg-linear-to-b from-card to-pink-500/10 from-30%">
                    <CardHeader>
                        <CardTitle>Top category</CardTitle>
                        <CardAction>{getCategoryIcon(baseInfo?.topCategory)}</CardAction>
                    </CardHeader> 
                    <CardContent>
                        <h1 className="text-xl capitalize font-medium">{baseInfo?.topCategory} <span className="text-base font-normal">({formatDuration(baseInfo?.topCategoryFocusTime)})</span></h1>
                    </CardContent>         
                </Card> 
                <Card className="w-full sm:w-1/3 bg-linear-to-b from-card to-emerald-500/10 from-30%">
                    <CardHeader>
                        <CardTitle>Average focus time</CardTitle>
                        <CardAction><AlignCenterHorizontal size={20}/></CardAction>
                    </CardHeader>
                    <CardContent>
                        <h1 className="text-xl font-medium"> {formatDuration(baseInfo?.averageSessionTime)}</h1>
                    </CardContent>
                    
                </Card>        
            </div>  
        </div>

        
        <div className="w-full flex flex-col items-start gap-3">
            <div>
                <CardTitle>Focus analytics</CardTitle>
                <CardDescription>Your focus time over the past 7 days. Insights into your recent focus performance..</CardDescription>
            </div>
            <Card className="w-full">
            <CardHeader>
                <CardTitle>Weekly Focus</CardTitle>
                <CardDescription>Focus time for the past 7 days</CardDescription>
                <CardAction><CalendarSync size={20}/></CardAction>
            </CardHeader>

            <CardContent>
                <ChartContainer className="sm:h-40 w-full" config={chartConfig}>
                <AreaChart data={chartData}>
                    <CartesianGrid vertical={false} />

                    <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                        weekday: "short",
                        })}
                    />

                    <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                    />

                    <Area
                    dataKey="totalFocus"
                    type="natural"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    stroke="#3b82f6"
                    />
                </AreaChart>
                </ChartContainer>
            </CardContent>
            </Card>  
        </div>
        
        
        </div>
    );
};

export default AnalyticsPage;