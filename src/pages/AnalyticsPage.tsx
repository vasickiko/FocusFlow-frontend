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
import { AlignCenterHorizontal, BookOpen, CalendarSync, Check,  CircleSlash, CodeXml, LoaderCircle, Notebook, Palette, Pencil, ScissorsLineDashed, Timer } from "lucide-react";

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

  const [streak, setStreak] = useState<any>(null);

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

    const fetchStreakInfo = async () => {
        try{
            setLoading(true)
            const res = await api.get("/analytics/streak-focus")
            console.log(res.data)
            setStreak(res.data)
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false)
        }
    }

    fetchBaseInfo()
    fetchWeeklyFocus();
    fetchStreakInfo(); 
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
        <div className="container sm:pb-8 sm:pr-3 flex flex-col items-start gap-9 mx-auto">

         <div className="w-full flex sm:hidden flex-col items-start gap-3">
            <div>
                <CardTitle>Consistency streak</CardTitle>
                <CardDescription>Your focus consistency over the past 7 days.</CardDescription>
            </div>
            
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Productivity streak</CardTitle>
                    <CardAction><h1 className="text-xl font-medium">{streak?.streak} <span className="text-base font-normal">{streak?.streak > 1 ? "days" : "day"}</span></h1></CardAction>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    {streak?.days?.map((day: any) => (
                        <div key={day.date || day.day} className="flex flex-col items-center gap-1">
                            <p>{day?.day}</p>
                            {day?.focused ?  <Check strokeWidth={3} size={14}/> : <CircleSlash strokeWidth={3} size={14}/>}
                        </div>
                       
                    ))}
                </CardContent>
                    
            </Card>
         </div>

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

        
        <div className="w-full flex sm:hidden flex-col items-start gap-3">
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
                        content={
                            <ChartTooltipContent
                            formatter={(value) => {
                                const seconds = Number(value)

                                const hours = Math.floor(seconds / 3600)
                                const minutes = Math.floor((seconds % 3600) / 60)

                                if (hours > 0) {
                                return [`${hours}h ${minutes}m`, "Focus"]
                                }

                                return [`${minutes}m`, "Focus"]
                            }}
                            />
                        }
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

         <div className="w-full hidden sm:flex flex-col items-start gap-3">
            <div>
                <CardTitle>Focus analytics and consistency streak</CardTitle>
                <CardDescription>Your focus time over the past 7 days. Insights into your recent focus performance..</CardDescription>
            </div>
            <div className="flex gap-4 items-center w-full">
                <Card className="w-2/3">
                <CardHeader>
                    <CardTitle>Weekly Focus</CardTitle>
                    <CardDescription>Focus time for the past 7 days</CardDescription>
                    <CardAction><CalendarSync size={20}/></CardAction>
                </CardHeader>

                <CardContent>
                    <ChartContainer className="h-40 w-full" config={chartConfig}>
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
                        content={
                            <ChartTooltipContent
                            formatter={(value) => {
                                const seconds = Number(value)

                                const hours = Math.floor(seconds / 3600)
                                const minutes = Math.floor((seconds % 3600) / 60)

                                if (hours > 0) {
                                return [`${hours}h ${minutes}m`, " Focus"]
                                }

                                return [`${minutes}m`, " Focus"]
                            }}
                            />
                        }
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
                <Card className="w-1/3 !h-full">
                        <CardHeader>
                            <CardTitle>Productivity streak</CardTitle>
                            <CardDescription>Track your streak</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="flex h-40 flex-col items-center justify-between">
                            <div className="h-20 w-20  mx-auto rounded-full flex items-center justify-center p-5 border-2">
                                <h1 className="text-xl flex items-end gap-1 font-medium">{streak?.streak}<span className="text-base font-normal">{streak?.streak > 1 ? "days" : "day"}</span></h1>
                            </div>

                            <div className="flex items-center justify-between w-full">
                                 {streak?.days?.map((day: any) => (
                                <div key={day.date || day.day} className="flex flex-col items-center gap-1">
                                    <p>{day?.day}</p>
                                    {day?.focused ?  <Check strokeWidth={3} size={14}/> : <CircleSlash strokeWidth={3} size={14}/>}
                                </div>
                            
                            ))}
                            </div>
                           
                        </CardContent>
                            
                </Card>  

            </div>
            
        </div>

        
        
        </div>
    );
};

export default AnalyticsPage;