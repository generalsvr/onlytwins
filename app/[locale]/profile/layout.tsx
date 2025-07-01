import { Metadata } from 'next';

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
