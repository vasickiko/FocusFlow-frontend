import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//api
import api from "@/api/api"

import { toast } from "sonner";

// redux
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { getTasks, addTask, selectTask, toggleTaskState } from "../features/tasks/tasksSlice";

// icons
import { Check, CircleSlash,  Crosshair, Ellipsis, FolderGit2, Grid2x2, Info, LoaderCircle, Moon, Play, Plus, Rows3, Timer} from "lucide-react";

// shadcn
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

type PresetType = {
  type: "prebuild" | "custom";
  name?: string;
  focus: number;
  break: number;
};

const TasksPage = () => {

  const navigate = useNavigate()

  //filtering
  const [view, setView] = useState("grid")
  const [sort, setSort] = useState("all") 
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingChangingStatus, setLoadingChangingStatus] = useState(false);

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preset, setPreset] = useState("");
  const [presetType, setPresetType] = useState<"prebuild" | "custom">("prebuild");
  const [customFocus, setCustomFocus] = useState("");
  const [customBreak, setCustomBreak] = useState("");

  const [showGrid, setShowGrid] = useState("2");

  const { tasks } = useSelector((state: RootState) => state.tasks);

  const dispatch = useDispatch();

  const presets = [
    { value: "pomodoro", name: "Pomodoro", focus: 1500, break: 300},
    { value: "deep-work", name: "Deep Work", focus: 3000, break: 600, },
  ];

  const minuteOptions = [
    "10", "20", "30", "40", "50", "60",
    "70", "80", "90", "100", "120", "130",
    "140", "150", "160", "170", "180"
  ];

  //formatting
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getPresetTime = (preset: PresetType) => {
    return `${preset.focus / 60}min / ${preset.break / 60}min`;
  };

  const getPresetLabel = (preset: PresetType) => {
    if(!preset.name) return `Custom preset`
    return `${preset.name}`;
  };

  const getPresetIcon = (preset: PresetType) => {
    if(preset){
      if(preset.type === "prebuild")
        if(preset.name === "Pomodoro"){
          return <Crosshair size={16} strokeWidth={2.5}/>
        }else if(preset.name === "Deep Work"){
          return <Moon size={16} strokeWidth={2.5} />
        }
    }
  }

  const getStatusLabel = (status: string) => {
    if(status === "completed"){
      return <p className="flex text-base items-center gap-1"><Check strokeWidth={3} size={14}/>Completed</p>
    }else if(status === "in_progress"){
      return <p className="flex text-base items-center gap-1"><LoaderCircle strokeWidth={3} className="animate-spin [animation-duration:3s]" size={14}/>In progress</p>
    }else if(status === "not_completed"){
      return <p className="flex text-base items-center gap-1"><CircleSlash strokeWidth={3} size={14} />Incomplete</p>
    }
  };

  //api calls
  const handleAddTask = async () => {
  if (!title.trim() || !category || !description) return;

  let finalPreset: PresetType;

  if (presetType === "prebuild") {
    if (!preset) return;

    const selectedPreset = presets.find((item) => item.value === preset);
    if (!selectedPreset) return;

    finalPreset = {
      type: "prebuild",
      name: selectedPreset.name,
      focus: selectedPreset.focus,
      break: selectedPreset.break,
    };
  } else {
    if (!customFocus || !customBreak) return;

    finalPreset = {
      type: "custom",
      focus: Number(customFocus) * 60,
      break: Number(customBreak) * 60,
    };
  }

  const data = {
    category,
    title,
    description,
    preset: finalPreset,
  };

  const promise = api.post("/api/create-task", data);

  toast.promise(promise, {
    loading: "Creating task...",
    success: (res) => {
      dispatch(
        addTask({
          _id: res.data._id,
          category: res.data.category,
          title: res.data.title,
          description: res.data.description,
          preset: res.data.preset,
          status: res.data.status,
          createdAt: res.data.createdAt,
        })
      );

      // reset form
      setCategory("");
      setTitle("");
      setDescription("");
      setPreset("");
      setPresetType("prebuild");
      setCustomFocus("");
      setCustomBreak("");

      return "Task created successfully";
    },
    error: "Failed to create task",
  });
  };


  const fetchAllTasks = async () => {
    try{
      setLoading(true);
      const res = await api.get("/api/tasks/get-all")
      const mappedTasks = res.data.map((task: any) => ({
        _id: task._id,
        category: task.category,
        title: task.title,
        description: task.description,
        preset: task.preset,
        status: task.status,
        createdAt: task.createdAt,
      }))

      dispatch(getTasks(mappedTasks))
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  }

  const handleChangeStatus = async (taskId: string, status: "completed" | "in_progress" | "not_completed") => {
    try{
      setLoadingChangingStatus(true);
      await api.post(`/api/tasks/mark-as/${taskId}`, {status})
      dispatch(toggleTaskState({taskId, status}))
    }catch(err){
      console.log(err)
    }finally{
      setLoadingChangingStatus(false);
    }
  }

  //use effect
  useEffect(() => {
    fetchAllTasks()
  }, [])
  
  const filteredTasks = [...tasks].filter((task) => {
    if (sort === "all") return true;
    return task.status === sort;
  }).filter((task) => {
    const search = query.toLowerCase();
    return (
      task.title.toLowerCase().includes(search) ||
      task.description?.toLowerCase().includes(search)
    );
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (loading) return <div className="w-full h-full flex items-center justify-center"><LoaderCircle className="animate-spin" /></div>;

  return (
    <div className="container pb-8 flex flex-col items-start gap-4 pr-0 sm:pr-2 mx-auto ">

      {tasks.length >= 1 && (
      <div className="w-full flex-col sm:flex-row flex gap-2 items-center">

        <div className="flex w-full sm:hidden items-center gap-2">
          <InputGroup className="flex-1">
            <InputGroupInput  placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)}/>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">{filteredTasks.length} results</InputGroupAddon>
          </InputGroup>
          <Card className="bg-transparent flex-row p-0 gap-0 rounded-lg">
            <Button onClick={()=>setView("grid")} className="h-8 w-8" variant={view === "grid" ? "default" : "ghost"}><Grid2x2 /></Button>
            <Button onClick={()=>setView("col")} className="h-8 w-8" variant={view === "col" ? "default" : "ghost"}><Rows3 /></Button>
          </Card>
          <Card className="bg-transparent flex-row p-0 gap-0 rounded-lg">
            <Select >
              <SelectTrigger className="border-0">
                <SelectValue placeholder={showGrid} />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="2" onClick={() => setShowGrid("2")}>2</SelectItem>
                <SelectItem value="1" onClick={() => setShowGrid("1")}>1</SelectItem>   
              </SelectContent>
            </Select>
          </Card>
        </div>

        <InputGroup className="hidden sm:flex flex-1">
          <InputGroupInput placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">{filteredTasks.length} results</InputGroupAddon>
        </InputGroup>

        <Card className="hover:shadow-none bg-transparent w-full sm:w-fit flex-row items-center justify-between p-0 gap-0 rounded-lg">
          <Button onClick={() => setSort("all")} variant={sort === "all" ? "default" : "ghost"}>All</Button>
          <Button onClick={() => setSort("completed")} className="flex-1" variant={sort === "completed" ? "default" : "ghost"}>Completed</Button>
          <Button onClick={() => setSort("in_progress")} className="flex-1" variant={sort === "in_progress" ? "default" : "ghost"}>In progress</Button>
          <Button onClick={() => setSort("not_completed")} className="flex-1" variant={sort === "not_completed" ? "default" : "ghost"}>Not completed</Button>
        </Card>
        <Card className="hover:shadow-none bg-transparent hidden sm:flex flex-row p-0 gap-0 rounded-lg">
          <Button onClick={()=>setView("grid")} className="h-8 w-8" variant={view === "grid" ? "default" : "ghost"}><Grid2x2 /></Button>
          <Button onClick={()=>setView("col")} className="h-8 w-8" variant={view === "col" ? "default" : "ghost"}><Rows3 /></Button>
        </Card>
      </div>
      )}

      {filteredTasks.length >= 1 && view === "grid" &&
        <div className={`w-full grid mt-2 grid-cols-${showGrid} sm:grid-cols-4 gap-x-4 gap-y-14`}>
          <div>
              <div className="flex items-center gap-1 h-6">
                <p>Add task</p>
                <HoverCard>
                  <HoverCardTrigger><Info size={14}/></HoverCardTrigger>
                  <HoverCardContent>Click on the "+" icon in order to create your task.</HoverCardContent>
                </HoverCard>
            </div>
            <Card className="flex items-center justify-center mt-2 h-full">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="bg-blue-500 cursor-pointer p-2 rounded-full text-white">
                    <Plus strokeWidth={3}/>
                  </div>      
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <form className="w-full" onSubmit={(e) => {e.preventDefault(); handleAddTask();}}>
                      <FieldGroup>
      
                        <Field>
                          <FieldLabel htmlFor="task-category">Category</FieldLabel>
                            <Select value={category} onValueChange={setCategory}>
                              <SelectTrigger className="w-full " id="task-category">
                                <SelectValue  placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Category</SelectLabel>
                                  <SelectItem value="code">Code</SelectItem>
                                  <SelectItem value="study">Study</SelectItem>
                                  <SelectItem value="read">Read</SelectItem>
                                  <SelectItem value="paint">Paint</SelectItem>
                                  <SelectItem value="craft">Craft</SelectItem>
                                  <SelectItem value="crochet">Crochet</SelectItem>
                                  <SelectItem value="write">Write</SelectItem>    
                                  </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="task-title">Title</FieldLabel>
                            <Input id="task-title" type="text" placeholder="Example: Learning React.js" value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="task-description">Description</FieldLabel>
                          <Input required={false} id="task-description" type="text" placeholder="Example: Understanding props" value={description} onChange={(e) => setDescription(e.target.value)}/>                          
                        </Field>

                        <Field>
                          <RadioGroup className="mb-4" value={presetType} onValueChange={(value) => setPresetType(value as "prebuild" | "custom")}>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="prebuild" id="option-one" />
                              <Label htmlFor="option-one">Prebuild Presets</Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="custom" id="option-two" />
                              <Label htmlFor="option-two">Custom Preset</Label>
                            </div>
                          </RadioGroup>
                            {presetType === "prebuild" ? (
                              <>
                              <FieldLabel htmlFor="task-preset">Choose Preset</FieldLabel>
                              <Select value={preset} onValueChange={setPreset}>
                                <SelectTrigger className="w-full" id="task-preset">
                                  <SelectValue placeholder="Preset" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Preset</SelectLabel>
                                      {presets.map((presetItem) => (
                                        <SelectItem key={presetItem.value} value={presetItem.value}>
                                          {presetItem.name} ({formatTime(presetItem.focus)}m / {formatTime(presetItem.break)}m)
                                        </SelectItem>))}
                                    </SelectGroup>
                                </SelectContent>
                              </Select>
                              </>
                              ) : (
                              <FieldGroup className="flex flex-row gap-4">
                                <Field className="flex-1">
                                  <FieldLabel htmlFor="task-custom-focus">Focus</FieldLabel>
                                    <Select value={customFocus} onValueChange={setCustomFocus}>
                                      <SelectTrigger className="w-full" id="task-custom-focus">
                                        <SelectValue placeholder="Focus" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectLabel>Focus</SelectLabel>
                                            {minuteOptions.map((minute) => (
                                              <SelectItem key={minute} value={minute}>
                                                {minute} min
                                              </SelectItem>
                                            ))}
                                          </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field className="flex-1">
                                  <FieldLabel htmlFor="task-custom-break">Break</FieldLabel>
                                    <Select value={customBreak} onValueChange={setCustomBreak}>
                                      <SelectTrigger className="w-full" id="task-custom-break">
                                        <SelectValue placeholder="Break" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectLabel>Break</SelectLabel>
                                            {minuteOptions.map((minute) => (
                                              <SelectItem key={minute} value={minute}>
                                                {minute} min
                                              </SelectItem>
                                            ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                </Field>
                              </FieldGroup>
                                )}
                        </Field>

                      </FieldGroup>
                    </form>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="outline" type="button">Cancel</Button>
                    </AlertDialogCancel>
                    <Button type="button" onClick={handleAddTask}>Add Task</Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Card>
          </div>

          {filteredTasks.map((task) => (
                <div>
                  <div className="flex h-6 items-center justify-between">     
                   { loadingChangingStatus ? <LoaderCircle strokeWidth={3} className="animate-spin" size={14}/> : getStatusLabel(task.status) }           
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild >
                          <Button size={"xs"} variant="outline"><Ellipsis /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Mark as</DropdownMenuLabel>
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleChangeStatus(task._id, "completed")}}>
                              <Check strokeWidth={2.5}/> Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleChangeStatus(task._id, "in_progress")}}>
                                <LoaderCircle strokeWidth={2.5} className="animate-spin [animation-duration:3s]"/>In progress
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleChangeStatus(task._id, "not_completed")}}>
                                <CircleSlash strokeWidth={2.5}/>Incomplete
                              </DropdownMenuItem>
                          </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                          <DropdownMenuItem className="hover:!bg-transparent">            
                            <Button variant={"destructive"}  className=" w-full">Remove</Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>        
                  </div>

                  <Card className="cursor-pointer mt-2 h-full" key={task._id} onClick={() => { dispatch(selectTask(task._id)); navigate(`/dashboard/tasks/${task._id}`);}}>
                    <CardHeader>
                      <Badge className="mb-1" variant={"secondary"}>{task.category}</Badge>
                      <CardTitle>{task.title}</CardTitle>    
                      <CardDescription>
                        {task.description}
                      </CardDescription>

                      {/* <CardAction className="hidden">
                        <Badge variant={"secondary"}>{task.category}</Badge>
                      </CardAction> */}

                    </CardHeader>

                    <CardFooter className="flex flex-col gap-3 sm:flex-row justify-between sm:items-end items-start">
                      <div className="space-y-1">
                          <p className="flex items-center gap-1 font-medium"><Timer size={16} strokeWidth={2.5}  />{getPresetTime(task.preset)}</p>        
                          <p className="flex items-center gap-1 font-medium">{getPresetIcon(task.preset)}{getPresetLabel(task.preset)}</p>            
                      </div>

                      <div className="p-2 hidden sm:block w-fit rounded-full bg-blue-500">
                        <Play fill="white" stroke="white" size={15}/>
                      </div>

                      <Button className="w-full sm:hidden bg-blue-500 text-white">Start task</Button>
                
                    </CardFooter>
                  </Card>
                </div>
          ))}
        </div>
      }

       {filteredTasks.length == 0 && tasks.length > 0 &&
        <div className="w-full flex gap-1 items-center justify-center py-12">
          No tasks found <CircleSlash size={15}/>
        </div>
       }
     
      {tasks.length == 0 &&   
        <div className="w-full flex gap-1 items-center justify-center py-12">
          <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderGit2 />
            </EmptyMedia>
              <h1 className="flex items-center gap-2 leading-tighter text-2xl font-semibold tracking-tight text-balance text-primary lg:leading-[1.1] lg:font-semibold xl:text-4xl xl:tracking-tighter max-w-4xl">No tasks found</h1>
            <EmptyDescription>You haven't created any task yet. Get started by creating your first task.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="bg-blue-500 cursor-pointer p-2 rounded-full text-white">
                    <Plus strokeWidth={3}/>
                  </div>      
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <form className="w-full" onSubmit={(e) => {e.preventDefault(); handleAddTask();}}>
                      <FieldGroup>
      
                        <Field>
                          <FieldLabel htmlFor="task-category">Category</FieldLabel>
                            <Select value={category} onValueChange={setCategory}>
                              <SelectTrigger className="w-full " id="task-category">
                                <SelectValue  placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Category</SelectLabel>
                                  <SelectItem value="code">Code</SelectItem>
                                  <SelectItem value="study">Study</SelectItem>
                                  <SelectItem value="read">Read</SelectItem>
                                  <SelectItem value="paint">Paint</SelectItem>
                                  <SelectItem value="craft">Craft</SelectItem>
                                  <SelectItem value="crochet">Crochet</SelectItem>     
                                  <SelectItem value="write">Write</SelectItem>                     
                                  </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="task-title">Title</FieldLabel>
                            <Input id="task-title" type="text" placeholder="Example: Learning React.js" value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="task-description">Description</FieldLabel>
                          <Input required={false} id="task-description" type="text" placeholder="Example: Understanding props" value={description} onChange={(e) => setDescription(e.target.value)}/>                          
                        </Field>

                        <Field>
                          <RadioGroup className="mb-4" value={presetType} onValueChange={(value) => setPresetType(value as "prebuild" | "custom")}>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="prebuild" id="option-one" />
                              <Label htmlFor="option-one">Prebuild Presets</Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="custom" id="option-two" />
                              <Label htmlFor="option-two">Custom Preset</Label>
                            </div>
                          </RadioGroup>
                            {presetType === "prebuild" ? (
                              <>
                              <FieldLabel htmlFor="task-preset">Choose Preset</FieldLabel>
                              <Select value={preset} onValueChange={setPreset}>
                                <SelectTrigger className="w-full" id="task-preset">
                                  <SelectValue placeholder="Preset" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Preset</SelectLabel>
                                      {presets.map((presetItem) => (
                                        <SelectItem key={presetItem.value} value={presetItem.value}>
                                          {presetItem.name} ({formatTime(presetItem.focus)}m / {formatTime(presetItem.break)}m)
                                        </SelectItem>))}
                                    </SelectGroup>
                                </SelectContent>
                              </Select>
                              </>
                              ) : (
                              <FieldGroup className="flex flex-row gap-4">
                                <Field className="flex-1">
                                  <FieldLabel htmlFor="task-custom-focus">Focus</FieldLabel>
                                    <Select value={customFocus} onValueChange={setCustomFocus}>
                                      <SelectTrigger className="w-full" id="task-custom-focus">
                                        <SelectValue placeholder="Focus" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectLabel>Focus</SelectLabel>
                                            {minuteOptions.map((minute) => (
                                              <SelectItem key={minute} value={minute}>
                                                {minute} min
                                              </SelectItem>
                                            ))}
                                          </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field className="flex-1">
                                  <FieldLabel htmlFor="task-custom-break">Break</FieldLabel>
                                    <Select value={customBreak} onValueChange={setCustomBreak}>
                                      <SelectTrigger className="w-full" id="task-custom-break">
                                        <SelectValue placeholder="Break" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectLabel>Break</SelectLabel>
                                            {minuteOptions.map((minute) => (
                                              <SelectItem key={minute} value={minute}>
                                                {minute} min
                                              </SelectItem>
                                            ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                </Field>
                              </FieldGroup>
                                )}
                        </Field>

                      </FieldGroup>
                    </form>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="outline" type="button">Cancel</Button>
                    </AlertDialogCancel>
                    <Button type="button" onClick={handleAddTask}>Add Task</Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </EmptyContent>
        </Empty>
        </div>
      }

      {filteredTasks.length >= 1 && view === "col" &&  
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Task Id</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Task title</TableHead>
              <TableHead>Preset name</TableHead>
              <TableHead>Focus time</TableHead>
              <TableHead>Break time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task, index)=>(
              <TableRow onClick={() => { dispatch(selectTask(task._id)); navigate(`/dashboard/tasks/${task._id}`);}}>
                <TableCell className="font-medium">#{index+1}</TableCell>
                <TableCell>{task.category}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.preset.type}</TableCell>
                <TableCell>{task.preset.focus}</TableCell>
                <TableCell>{task.preset.break}</TableCell>
                <TableCell>{getStatusLabel(task.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild >
                      <Button variant="outline">Manage</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Mark as</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleChangeStatus(task._id, "completed")}}>
                            <Check strokeWidth={2.5}/> Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleChangeStatus(task._id, "in_progress")}}>
                            <LoaderCircle strokeWidth={2.5} className="animate-spin [animation-duration:3s]"/>In progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleChangeStatus(task._id, "not_completed")}}>
                            <CircleSlash strokeWidth={2.5}/>Incomplete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="hover:!bg-transparent">            
                            <Button variant={"destructive"}  className=" w-full">Remove</Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>  
                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }

    </div>
  );
};

export default TasksPage;