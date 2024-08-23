import * as React from 'react';
import type {Metadata} from 'next';

import {config} from '@/config';
import {GuestGuard} from '@/components/auth/guest-guard';
import {Layout} from '@/components/auth/layout';
import Login from "@/components/auth/login";

export const metadata = {title: `Sign in | Auth | ${config.site.name}`} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <GuestGuard>
        <Login/>
      </GuestGuard>
    </Layout>
);
}
