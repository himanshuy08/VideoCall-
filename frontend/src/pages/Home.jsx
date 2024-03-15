import { Toaster, toast } from "sonner";
import {
  Cast,
  Copy,
  Link2Icon,
  Mic,
  Plus,
  ScreenShare,
  TextIcon,
  Video,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useSocket } from "@/context/SocketProvider";

const Home = () => {
  const navigate = useNavigate();
  const { socket, meetingCode, setMeetingCode, name, setName } = useSocket();

  const handleCodeChange = (e) => {
    setMeetingCode(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const generateCode = () => {
    const id = nanoid();
    setMeetingCode(id);
  };

  const handleJoinMeeting = () => {
    console.log("Joining meeting...");
    if (!name || !meetingCode) {
      toast.error("Please enter name and meeting code.");
      return;
    }
    socket.emit("join", { name, meetingCode });
    console.log("Navigating to:", `/video/${meetingCode}`);
    navigate(`/video/${meetingCode}`);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(meetingCode);
    toast.success("Copied Meeting Link");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      <header className="px-4 lg:px-6 py-4 lg:py-6 flex items-center">
        <div className="flex items-center space-x-2">
          <Link className="flex items-center space-x-2" to="/">
            <span className="font-semibold">VideoCall</span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-6 md:py-12 lg:py-24 xl:py-32">
          <div className="container flex flex-col items-center justify-center px-4 space-y-4 md:px-6 lg:space-y-10">
            <div className="flex flex-col items-center space-y-2 text-center">
              <h1
                className="text-3xl font-bold tracking-tighter sm:text-5xl"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                High-Quality Video Calls Made Simple.
              </h1>
              <p
                className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Connect with your friends with the click of a button.
                <br />
                No downloads. No hassle.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Dialog asChild>
                <DialogTrigger>
                  <Button>
                    <Video className="mr-2 h-4 w-4" /> New Meeting
                  </Button>
                </DialogTrigger>
                <DialogContent className="lg:w-[300px] space-y-4 ">
                  <Dialog>
                    <DialogTrigger className="hover:bg-slate-200 h-8">
                      <div className="flex items-center gap-4">
                        <Link2Icon />
                        <span onClick={generateCode}>
                          Create a meeting for later
                        </span>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md ">
                      <DialogHeader>
                        <DialogTitle>Share Code</DialogTitle>
                        <DialogDescription>
                          Anyone who has this code will be able to join this.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                          <Label htmlFor="link" className="sr-only">
                            Link
                          </Label>
                          <Input id="link" readOnly value={meetingCode} />
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          className="px-3"
                          onClick={handleCopyCode}
                        >
                          <span className="sr-only">Copy</span>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <DialogTrigger className="hover:bg-slate-200 h-8 w-full">
                    <div className="flex items-center gap-4">
                      <Plus />
                      <span>Start an instant meeting</span>
                    </div>
                  </DialogTrigger>
                </DialogContent>
              </Dialog>

              <div className="flex items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-10">
                      <Cast className="mr-2 h-4 w-4" /> Join Meeting
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-0 bg-transparent border-none w-[350px]">
                    <Card className="w-[350px]">
                      <CardHeader>
                        <CardTitle>Join Room</CardTitle>
                        <CardDescription>
                          Enter the code to join.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form>
                          <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="name"> Name</Label>
                              <Input
                                id="name"
                                onChange={handleNameChange}
                                autoComplete="off"
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="room">Meeting Code</Label>
                              <Input
                                id="room-id"
                                onChange={handleCodeChange}
                                autoComplete="off"
                              />
                            </div>
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button variant="outline" onClick={handleJoinMeeting}>
                          Join
                        </Button>
                      </CardFooter>
                    </Card>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 text-center md:px-6 lg:gap-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Features
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our platform is packed with features to make your video calls
                more enjoyable.
              </p>
            </div>
            <div className="mx-auto max-w-3xl grid gap-10 sm:gap-4 lg:grid-cols-2">
              <div className="flex flex-col items-center space-y-2">
                <Video className="w-12 h-12 rounded-lg" />
                <div className="space-y-2  text-center">
                  <h3 className="font-bold">High-quality video calls</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Experience crystal-clear video on every call.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Mic className="w-12 h-12 rounded-lg" />
                <div className="space-y-2 text-center">
                  <h3 className="font-bold">Clear audio</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No more muffled sound. Our platform delivers high-quality
                    audio.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <ScreenShare className="w-12 h-12 rounded-lg" />
                <div className="space-y-2 text-center">
                  <h3 className="font-bold">Screen sharing</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Share your screen with the click of a button.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <TextIcon className="w-12 h-12 rounded-lg" />
                <div className="space-y-2 text-center">
                  <h3 className="font-bold">In-call chat</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Send messages during your video call.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col sm:flex-row py-6 w-full items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 VideoCall. All rights reserved.
        </p>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Home;
