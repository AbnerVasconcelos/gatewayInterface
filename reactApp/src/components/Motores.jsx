import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const columns = [
  {
    field: "motores",
    headerName: "Motores",
    flex: 1,
  },
  {
    field: "name",
    headerName: "Set Point",
    flex: 0.3,
  },
  {
    field: "type",
    headerName: "Tipo",
    flex: 1,
  },
  {
    field: "speed",
    headerName: "Velocidade Real",
    flex: 1,
  },
  {
    field: "corrente",
    headerName: "Corrente %",
    flex: 1,
  },
];

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.primary[500],
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 1,
  },
}));

const rows = [
  { motores: 'Extrusora', name: 90, type: 'RPM', speed: 90, corrente: 50 },
  { motores: 'Puxador 1', name: 55, type: 'm/min', speed: 55, corrente: 60 },
  { motores: 'Puxador 2', name: 10, type: '%', speed: 10, corrente: 61 },
  { motores: 'Bobinador 1', name: 10, type: '%', speed: 10, corrente: 65 },
  { motores: 'Bobinador 2', name: 10, type: '%', speed: 10, corrente: 67 },
  { motores: 'Anel de Ar', name: 10, type: 'Hz', speed: 10, corrente: 50 },
  { motores: 'Giratório', name: 'true', type: 'on/off', speed: '', corrente: '' },
];

const Motores = () => {
  const theme = useTheme();
  

  return (
    <Box
      gridColumn="span 8"
      gridRow="span 4"
      sx={{
        "& .MuiDataGrid-root": {
          border: "none",
          borderRadius: "5rem",
          backgroundColor: "blue", // Definindo a cor de fundo da tabela como azul
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: theme.palette.background.alt,
          color: theme.palette.secondary[100],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: theme.palette.background.alt,
        },
        "& .MuiDataGrid-footerContainer": {
          backgroundColor: theme.palette.background.alt,
          color: theme.palette.secondary[100],
          borderTop: "none",
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `${theme.palette.secondary[200]} !important`,
        },
      }}
    >
      <StyledTableRow>
     
        
        <Table sx={{ minWidth: 700, minHeight: 550}}  aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>{column.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {columns.map((column) => (
                  <TableCell key={column.field} component="th" scope="row">
                    {row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      
      </StyledTableRow>
    </Box>
  );
};

export default Motores;
