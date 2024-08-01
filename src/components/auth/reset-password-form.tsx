'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { authClient } from '@/lib/auth/client';

const schema = zod.object({ email: zod.string().min(1, { message: 'Email is required' }).email() });

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '' } satisfies Values;

export function ResetPasswordForm(): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });


  return (
    <Stack spacing={4}>
      <Typography variant="h5">Reset password</Typography>

    </Stack>
  );
}
