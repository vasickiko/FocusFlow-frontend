import { useEffect } from "react";

//redux
import type { RootState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import { setSessions } from "../features/session/sessionSlice";

//shadcn
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CircleSlash} from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { Empty,  EmptyDescription, EmptyHeader, EmptyMedia } from "@/components/ui/empty";

//api
import api from "@/api/api";

const SessionsPage = () => {

  const dispatch = useDispatch()

  const { sessions } = useSelector((state: RootState) => state.sessions);

  useEffect(()=>{
    const fetchSessions = async () => {
      try{
        const res = await api.get("/api/get/all-sessions")
        console.log(res.data)
        dispatch(setSessions(res.data))
      }catch(err){
        console.log(err)
      }
    }

    fetchSessions()
  }, [])
 
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Still running";

    return new Date(date).toLocaleString([], {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sortedSessions = [...sessions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="container pb-10 sm:pb-0 flex flex-col items-start gap-4 mx-auto ">

      {sessions.length >= 1 && (
        <div>
          <h1 className="leading-tighter text-2xl font-semibold tracking-tight text-balance text-primary lg:leading-[1.1] lg:font-semibold xl:text-4xl xl:tracking-tighter max-w-4xl">Sessions manager</h1>
          <p className="max-w-4xl text-base text-balance text-foreground sm:text-lg"> Track your focus history and completed sessions.</p>
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="w-full flex gap-1 items-center justify-center py-12">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleSlash/>
              </EmptyMedia>
                <h1 className="flex items-center gap-2 leading-tighter text-2xl font-semibold tracking-tight text-balance text-primary lg:leading-[1.1] lg:font-semibold xl:text-4xl xl:tracking-tighter max-w-4xl">No sessions found</h1>
              <EmptyDescription>You don't have any active session yet.</EmptyDescription>
            </EmptyHeader>  
          </Empty>
        </div>
      ) : (
        <div className=" w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedSessions.map((session, index) => (
            <Card  className="h-fit">
              <CardHeader>
                <CardTitle>{session.taskId?.title || "Deleted task"}</CardTitle>
                <CardDescription>Session #{index + 1}</CardDescription>
                <CardAction><Badge variant={"destructive"}>{session.completed ? "Completed" : "Incomplete"}</Badge></CardAction>
              </CardHeader>

              <CardContent className="flex justify-between items-center gap-2">
                <div className="bg-muted/50 flex-1 p-2 rounded-lg border">
                  <p>Planned</p>
                  <p className="font-medium">{formatTime(session.plannedDuration)}m</p>
                </div>
                <div className="bg-muted/50 flex-1 p-2 rounded-lg border">
                  <p>Actual</p>
                  <p className="font-medium">{formatTime(session.actualDuration)}m</p>
                </div>
              </CardContent>

              <CardFooter className="flex-col items-start">
                <div className="flex-1 w-full flex items-center justify-between">
                    <p>Started:</p>
                    <p className="font-medium">{formatDate(session.createdAt)}</p>
                </div>
                <hr  className="w-full my-2"/>
                <div className="flex-1 w-full flex items-center justify-between">
                    <p>Ended:</p>
                    <p className="font-medium">{formatDate(session.endedAt)}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Table>
        <TableCaption>A list of your session/s per task.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Session Id</TableHead>
            <TableHead>Task title</TableHead>
            <TableHead>Planned time</TableHead>
            <TableHead>Actual time</TableHead>
            <TableHead>Started at</TableHead>
            <TableHead>Ended at</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>     
          {sortedSessions.map((session, index)=>(
            <TableRow>
              <TableCell className="font-medium">#{index+1}</TableCell>
              <TableCell>{session.taskId?.title || "Deleted task"}</TableCell>
              <TableCell>{formatTime(session.plannedDuration)}m</TableCell>
              <TableCell>{formatTime(session.actualDuration)}m</TableCell>
              <TableCell>{formatDate(session.createdAt)}</TableCell>
              <TableCell>{formatDate(session.endedAt)}</TableCell>
              <TableCell className="text-right"><Badge variant={"destructive"}>{session.completed ? "Completed" : "Incomplete"}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionsPage;