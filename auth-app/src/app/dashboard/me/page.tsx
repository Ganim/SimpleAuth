import { getUserProfile } from '@/auth/get-user-profile';
import { getUserRole } from '@/auth/get-user-role';
import { printUserRole } from '@/auth/print-user-role';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default async function MePage() {
  const { profile } = await getUserProfile();
  const role = await getUserRole();

  return (
    <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb className='my-2'>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Me</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min py-4 px-6">
            <div className='flex justify-between mb-6'>
              <div className='flex items-center gap-6'>
                  <Avatar className="size-24">
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback>{profile.name?.[0]}{profile.surname?.[0]}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col gap-1 '>
                  <h1 className="text-2xl font-bold">{profile.name} {profile.surname}</h1>
                  <p className="text-muted-foreground">
                  {printUserRole(role)}
                  
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Button className="px-4 py-2">
                  Edit Profile
                </Button>

              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold">Bio</h2>
              <p className="text-muted-foreground">
                {profile.bio || 'No bio available.'}
              </p>
            </div>
            
            
          </div>
        </div>
      </>
    
  );
}
