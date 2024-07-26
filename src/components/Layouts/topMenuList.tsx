import Icons from "icons/sidebar";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

const index = [
  // {
  //   title: "",
  //   Icon: Icons.DashboardIcon,
  //   path: "/home/in-game/",
  // },
  // {
  //   title: "User Profile",
  //   Icon: Icons.UserProfileIcon,
  //   path: "/dashboard/user-profile",
  // },
  {
    title: "놀이방",
    Icon: SportsEsportsIcon,
    path: "/home/game-room",
  },
  {
    title: "순위",
    Icon: MilitaryTechIcon,
    path: "/home/user-rank",
  },
  // {
  //   title: "Add Room",
  //   Icon: Icons.AddUserIcon,
  //   path: "/home/add-room",
  // },
  {
    title: "Log Out",
    Icon: Icons.LoginIcon,
    path: "/login",
  },
  // {
  //   title: "Register",
  //   Icon: Icons.SessionsIcon,
  //   path: "/Register",
  // },
];

export default index;
