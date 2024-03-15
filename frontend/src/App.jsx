import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import VideoScreen from "./pages/VideoScreen";
import { SocketProvider } from "./context/SocketProvider";

const App = () => {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video/:meetId" element={<VideoScreen />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
};

export default App;
