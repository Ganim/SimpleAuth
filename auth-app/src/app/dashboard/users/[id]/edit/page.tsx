import { getUserRole } from '@/auth/get-user-role';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { HTTPGetUserProfile } from '@/http/users/get-user-profile';
import { notFound } from 'next/navigation';

interface EditUserPageProps {
  params: { id: string }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { profile } = await HTTPGetUserProfile(params.id);
  if (!profile) return notFound();

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
                
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/users">
                    Users
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />

                <BreadcrumbItem >
                    <BreadcrumbPage>Edit User</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <form >
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
                  
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                
                <Button variant={'destructive'} className="px-4 py-2">
                  Delete <span className="hidden md:block">Profile</span>
                </Button>
                
                <Button type='submit' className="px-4 py-2">
                  Save <span className="hidden md:block">Profile</span>
                </Button>
            
              </div>
            </div>
            <div className="w-full flex flex-col gap-4">
              
          <div>
            <Label htmlFor="name" className="text-xs text-muted-foreground">Nome</Label>
            <Input id="name" name="name" defaultValue={profile.name} />
          </div>
          <div>
            <Label htmlFor="surname" className="text-xs text-muted-foreground">Sobrenome</Label>
            <Input id="surname" name="surname" defaultValue={profile.surname} />
          </div>
          <div>
            <Label htmlFor="bio" className="text-xs text-muted-foreground">Bio</Label>
            <Input id="bio" name="bio" defaultValue={profile.bio} />
          </div>
          {role === 'ADMIN' && (
            <div>
              <Label htmlFor="role" className="text-xs text-muted-foreground">Cargo</Label>
              <Input id="role" name="role"  />
            </div>
          )}
       
            </div>
            
            
          </div> 
          </form>
        </div>
      </>
  );
}
