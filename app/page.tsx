'use client';

import { CommandPalette } from "@/components/commands/command-palette";
import { GlobalCommands } from "@/components/global/global-commands";
import { TaskList } from "@/components/tasks/task-list";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AiChatSidebar } from "@/components/ai/ai-chat-sidebar";
import { useAppSelector } from "@/store/hooks";
import { selectAiChatSidebarVisible } from "@/store/features/display/display-selectors";
import { cn } from "@/lib/utils";
import { Group, Panel, Separator } from "react-resizable-panels";

export default function Home() {
  const aiChatSidebarVisible = useAppSelector(selectAiChatSidebarVisible);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between gap-2 p-2">
        <h1 className="text-base tracking-wide">Agentask</h1>
        <div className="flex items-center gap-2">
          <GlobalCommands />
          <CommandPalette />
          <ThemeToggle />
        </div>
      </div>
      <div className={cn('px-2 pb-2 grow h-0')}>
        <Group orientation="horizontal">
          <Panel id="main" defaultSize={'100%'}>
            <TaskList />
          </Panel>
          {aiChatSidebarVisible && (
            <>
              <Separator className="w-px bg-border cursor-col-resize" />
              <Panel
                id="ai-chat"
                defaultSize={'30%'}
                minSize={'20%'}
                maxSize={'50%'}>
                <AiChatSidebar />
              </Panel>
            </>
          )}
        </Group>
      </div>
    </div>
  );
}
