'use client'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Bot, CreditCard, LayoutDashboard, Presentation } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
    {
        title:"Dashboard",
        url:"/dashboard",
        icon: LayoutDashboard
    },
    {
        title:"Q&A",
        url:"/qa",
        icon: Bot,
    },
    {
        title:"Meetings",
        url:"/meetings",
        icon: Presentation,
    },
    {
        title:"Billing",
        url:"/billing",
        icon: CreditCard,
    }

]


export function AppSidebar(){
    const pathname = usePathname()
    return (
       <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
            Logo
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>
                    Application
                </SidebarGroupLabel>
                <SidebarGroupContent>
 {items.map(item=>{
    return(
        <SidebarMenuItem  key={item.title}>
 <SidebarMenuButton asChild>
      <Link href={item.url} className="{cn({
      '!bg-primary !text-white':pathname === item.url'})}">
        <item.icon/>
        <span>{item.title}</span>
      </Link>
 </SidebarMenuButton>
        </SidebarMenuItem>
    )
 })}
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
       </Sidebar>
    )
}
export  default AppSidebar;