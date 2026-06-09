import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MembersGallery from './components/Members';
import AddUser from './components/AddUser';
import UserList from './components/UsersList';
import EditUser from './components/EditUser';
import Sidebar from './components/Sidebar';
import AddRobot from './components/AddRobots';
import RobotList from './components/RobotsList';
import EditRobot from './components/EditRobot';
import Search from './components/Search';
import Visualize from './components/Visualize';
import PostImage from './components/PostImage';
import LidarCharts from './components/Lidar';
import CameraCharts from './components/Camera';
import PcCharts from './components/Pc';
import GpsCharts from './components/Gps';
import View from './components/View';
import Notifications from './components/notifications';
import AddPlate from './components/AddPlate';
import PlateList from './components/PlatesList';
import EditPlate from './components/EditPlate';
import Report from './components/Report';

function App() {
  return (
  <>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="addMember" element={<PostImage/>} />
            <Route path="/membersList" element={<MembersGallery />} />
            <Route path="/addUser" element={<AddUser />} />
            <Route path="/usersList" element={<UserList />} />
            <Route path="/editUser" element={<EditUser />} />
            <Route path="/addRobot" element={<AddRobot />} />
            <Route path="robotsList" element={<RobotList />} />
            <Route path="/editRobot" element={<EditRobot />} />
            <Route path="/lidar" element={<LidarCharts />} />
            <Route path="/camera" element={<CameraCharts />} />
            <Route path="/pc" element={<PcCharts />} />
            <Route path="/gps" element={<GpsCharts/>} /> 
            <Route path="/robots/:uuid" element={<Visualize />} />
            <Route path="/view/:uuid" element={<View />} />
            <Route path="/side" element={<Sidebar />} />
            <Route path="/search" element={<Search />} />
            <Route path="/notif" element={<Notifications />} />
            <Route path="/addPlate" element={<AddPlate />} />
            <Route path="platesList" elemnt={<PlateList />} />
            <Route path="editPlate" element={<EditPlate />} />
            <Route path="getReport" element={<Report />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </>
  );
}

export default App;
