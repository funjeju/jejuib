import { Metadata } from 'next';
import { generateSchoolMetadata } from './metadata';

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return generateSchoolMetadata(params.id);
}

export default function SchoolLayout({ children }: Props) {
  return <>{children}</>;
}
