import { Metadata } from 'next';
import ProfilePage from '@/app/[locale]/profile/page';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Profile | OnlyTwins',
    description: 'Your profile',
  };
}

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
