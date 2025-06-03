import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRightOutlined,
  Speed,
  WarningAmber,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import Delfos from "./Delfos";
const navItems = [
  {
    text: "Operacao",
    icon: <Speed />,
  },
  {
    text: "MENU",
    icon: null,
  },
  {
    text: "Receitas",
    icon: <DescriptionIcon />,
  },
  {
    text: "Producao",
    icon: <TrendingUpIcon />,
  },
  {
    text: "Alarmes",
    icon: <WarningAmber />,
  },
  {
    text: "Calibragem",
    icon: <SquareFootIcon />,
  },
  {
    text: "Config",
    icon: <SettingsIcon />,
  },
  {
    text: "socket",
    icon: <WarningAmber />,
  },
];

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.primary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
          <Box m="1.5rem 1rem 1rem 4rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="left" gap="1rem" sx={{ marginLeft: "-2rem" }}>
                  <Typography variant="h3" fontWeight="bold">
                    Palantir
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            

            {/* Lista de Navegação */}
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography
                      variant="h4"
                      key={text}
                      sx={{ m: "1.5rem 1.5rem 0.5rem 2rem" }}
                    >
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "-0.4rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* Rodapé / Espaço futuro */}
          <Box 
          mt="auto" p="0.2rem 0 0 0rem"
 
          >
            <Divider />
              {/* Espaço reservado se quiser algo no rodapé */}
            <Delfos />
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
