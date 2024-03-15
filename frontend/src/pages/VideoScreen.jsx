import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Info,
  MessageSquareText,
  MicIcon,
  MonitorUp,
  PhoneOffIcon,
  Send,
  User,
  VideoIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import "../styles/videoscreen.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/context/SocketProvider";

const VideoScreen = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [myStream, setMyStream] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const videoRef = useRef(null); 

  const { meetingCode, name } = useSocket();

  console.log(meetingCode, name);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

 useEffect(() => {
  const getMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream; 
      }
    } catch (error) {
      console.error("Error accessing user media:", error);
    }
  };

  getMediaStream();

  return () => {
    // Cleanup function to close media devices
    if (myStream) {
      myStream.getTracks().forEach(track => {
        track.stop(); // Stop each track to release resources
      });
    }
  };
}, []);


  const formatMinutes = (mins) => {
    return mins < 10 ? `0${mins}` : mins;
  };

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(meetingCode);
    toast.success("Copied Meeting Link");
  };

  const handleCloseButton = () => {
    console.log("Return to home");
    navigate("/");
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (myStream) {
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = audioEnabled;
      });
      const audioMessage = audioEnabled ? "Audio Enabled" : "Audio Disabled";
      toast.info(audioMessage);
    }
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    if (myStream) {
      myStream.getVideoTracks().forEach((track) => {
        track.enabled = videoEnabled;
      });
      const videoMessage = videoEnabled? "Video Enabled" : "Video Disabled";
      toast.info(videoMessage);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <Toaster />
      <div className="flex flex-1 items-center justify-center">
        <div className="grid gap-2 w-full max-w-3xl px-4">
          <div className="rounded border border-gray-200 aspect-video overflow-hidden dark:border-gray-800">
            <video
              ref={videoRef} // Assign the ref to the video element
              className="w-full h-full object-cover rounded-md bg-muted"
              autoPlay
              playsInline
              muted
            />
          </div>
        </div>
      </div>
      <div className="menubar grid grid-cols-12 h-20 w-full">
        <div className="leftSide col-span-3 flex justify-start items-center  p-4">
          <div className="flex flex-row gap-4 text-lg items-center">
            <p className=" font-bold">{`${hours}:${formatMinutes(minutes)}`}</p>
            <div className="h-6 border-l border-black mx-4"></div>
            <p>{meetingCode}</p>
          </div>
        </div>
        <div className="p-4 flex items-center justify-center gap-6 col-span-6 ">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleAudio}
            className={`${audioEnabled ? "text-red-500" : "text-green-500"}`}
          >
            <MicIcon className="h-6 w-6" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleVideo}
            className={`${videoEnabled ? "text-red-500" : "text-green-500"}`}
          >
            <VideoIcon className="h-6 w-6" />
          </Button>
          <Button size="icon" variant="ghost">
            <MonitorUp className="h-6 w-6" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleCloseButton}>
            <PhoneOffIcon className="h-6 w-6" />
          </Button>
        </div>
        <div className="rightSide col-span-3 flex justify-evenly items-center  p-4">
          <Sheet>
            <SheetTrigger>
              <Info className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent className="h-[700px] my-6 mr-6 rounded-lg">
              <SheetHeader>
                <SheetTitle>Meeting Details</SheetTitle>
                <SheetDescription className="mt-4">
                  <p className="text-lg my-2">Joining Info</p>
                  <p className="text-xl w-full bg-blue-50 rounded-lg p-4 my-6">
                    {meetingCode}
                  </p>
                  <Button className="gap-4 " onClick={handleCopyCode}>
                    <Copy />
                    Copy Joining Info
                  </Button>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Popover>
            <PopoverTrigger>
              <User className="h-6 w-6 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent>{name}</PopoverContent>
          </Popover>

          <Sheet>
            <SheetTrigger>
              <MessageSquareText className="h-6 w-6 cursor-pointer" />
            </SheetTrigger>
            <SheetContent className="h-[700px] my-6 mr-6 rounded-lg ">
              <SheetHeader>
                <SheetTitle>In Call Messages</SheetTitle>
                <SheetDescription className="mt-4 flex flex-col justify-end ">
                  <div className="flex items-center justify-between h-[50px] gap-2 rounded-lg">
                    <Input
                      id="messages"
                      placeholder="Send a message"
                      className="border-none h-full bg-gray-100"
                    />
                    <Button className="border-none  h-full">
                      <Send />
                    </Button>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default VideoScreen;
