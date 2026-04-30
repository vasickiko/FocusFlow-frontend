import Navbar from "@/components/Navbar";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const cards = [
  {
    title: "Create tasks",
    description: "Create and manage your tasks with ease. Stay organized and productive.",
  },
  {
    title: "Choose technique",
    description: "Choose from a variety of techniques to suit your needs.",
  },
  {
    title: "Card 3",
    description: "This is the third card",
  },
]

const LandingPage = () => {
  return (
    <div className="bg-transparent h-screen overflow-hidden flex flex-col">
      <Navbar/>
      <div className="px-6 py-20 flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-1">
            <AvatarGroup >
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+3</AvatarGroupCount>
            </AvatarGroup>
            <p className="text-sm">Join 10,000+ users</p>
          </div>    
          <div className="flex flex-col gap-2">
            <h1 className="leading-tighter text-3xl font-semibold tracking-tight text-balance text-primary lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter max-w-4xl">Get things done with <span className="underline text-blue underline-offset-8 ">FocusFlow</span></h1>
            <p className="max-w-4xl text-base text-balance text-foreground sm:text-lg">FocusFlow is a productivity app that helps you manage your tasks and stay focused.</p>
          </div>
          <div className="flex gap-2">
            <Button>Get started</Button>
            <Button variant="outline">Learn more</Button>
          </div>
        </div>
         <Carousel className="w-full max-w-[18rem] sm:max-w-xs">
          <CarouselContent>
            {cards.map((card, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>{card.title}</CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{index + 1}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
};

export default LandingPage;