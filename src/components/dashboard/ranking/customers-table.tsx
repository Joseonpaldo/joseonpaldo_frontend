'use client';

import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import apiAxiosInstance from "@/hooks/apiAxiosInstance";

function noop(): void {
  // do nothing
}

interface CustomersTableProps {
  type?: String;
}

interface User {
  id: string;
  name: string;
  profileImage: string;
  winrate: number;
  play: number;
}

export function CustomersTable(props: CustomersTableProps): React.JSX.Element {
  const [fourToTen, setFourToTen] = useState<User[]>([]);

  useEffect(() => {
      apiAxiosInstance.get(`/ranking/${props.type}/fourToTen`)
      .then(response => {
        const data: User[] = response.data; // 응답 데이터 가져오기

        setFourToTen([...data]);
      })
      .catch(error => {
        console.error('문제가 발생했습니다:', error);
      });
  }, [props.type]);

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '400px' }}>
          <TableHead>
            <TableRow>
              <TableCell align={"center"}>등수</TableCell>
              <TableCell>별명</TableCell>
              <TableCell>승률</TableCell>
              <TableCell>총 게임수</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fourToTen.map((user, index) => {
              return (
                <TableRow hover key={user.id}>
                  <TableCell align={"center"}>
                    {index+4}등
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={user.profileImage} />
                      <Typography variant="subtitle2">{user.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.winrate}%</TableCell>
                  <TableCell>{user.play}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}
