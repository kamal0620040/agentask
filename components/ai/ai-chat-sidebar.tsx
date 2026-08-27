'use client';

import { useChat } from '@ai-sdk/react';
import { getToolName, isToolUIPart, type ChatAddToolOutputFunction, type UIMessage } from 'ai';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/components/ui/message';
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/components/ui/message-scroller';
import { useAiChatContext } from './ai-chat-context';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addTask,
  updateTask as reduxUpdateTask,
  deleteTask as reduxDeleteTask,
  assignTask as reduxAssignTask,
  addTaskLabel as reduxAddTaskLabel,
  removeTaskLabel as reduxRemoveTaskLabel,
} from '@/store/features/tasks/tasks-slice';
import { selectRawTasks } from '@/store/features/tasks/tasks-selector';
import { assignees } from '@/data/mock-assignee';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { RiSendPlaneFill } from 'react-icons/ri';
import type { TaskRaw, TaskStatus, TaskPriority } from '@/components/tasks/types';

function generateTaskId(tasks: TaskRaw[]): string {
  const max = tasks.reduce((acc, task) => {
    const match = task.id.match(/^[A-Z]+-(\d+)$/);
    return match ? Math.max(acc, parseInt(match[1], 10)) : acc;
  }, 0);
  return `MUL-${max + 1}`;
}

function assigneeName(id: unknown): string {
  return assignees.find((a) => a.id === String(id))?.name ?? String(id);
}

function ToolInvocationBadge({
  toolName,
  input,
  state,
}: {
  toolName: string;
  input: Record<string, unknown>;
  state: string;
}) {
  const isPending = state === 'input-streaming' || state === 'input-available';

  const label = (() => {
    switch (toolName) {
      case 'createTask':
        return `${isPending ? 'Creating' : 'Created'} task: ${input.title}`;
      case 'updateTask':
        return `${isPending ? 'Updating' : 'Updated'} task ${input.id}`;
      case 'deleteTask':
        return `${isPending ? 'Deleting' : 'Deleted'} task ${input.id}`;
      case 'assignTask':
        return `${isPending ? 'Assigning' : 'Assigned'} ${input.id} to ${assigneeName(input.assigneeId)}`;
      case 'unassignTask':
        return `${isPending ? 'Unassigning' : 'Unassigned'} ${input.id}`;
      case 'addTaskLabel':
        return `${isPending ? 'Adding' : 'Added'} label "${input.label}" to ${input.id}`;
      case 'removeTaskLabel':
        return `${isPending ? 'Removing' : 'Removed'} label "${input.label}" from ${input.id}`;
      default:
        return toolName;
    }
  })();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        'bg-primary/10 text-primary my-1',
      )}>
      {isPending ? (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
      ) : (
        <span>✓</span>
      )}
      {label}
    </div>
  );
}

export function AiChatSidebar() {
  const { tasks } = useAiChatContext();
  const rawTasks = useAppSelector(selectRawTasks);
  const dispatch = useAppDispatch();
  const [input, setInput] = useState('');

  const addToolOutputRef = useRef<ChatAddToolOutputFunction<UIMessage> | null>(
    null,
  );

  const { messages, sendMessage, addToolOutput, status, error } = useChat({
    id: 'ai-chat',
    onError: (err) => {
      console.error('Chat error:', err);
    },
    onToolCall: async ({ toolCall }) => {
      const tc = toolCall;
      const i = (tc.input ?? {}) as Record<string, unknown>;
      let output: unknown = { success: false };

      if (tc.toolName === 'createTask') {
        const newTask: TaskRaw = {
          id: generateTaskId(rawTasks),
          title: i.title as string,
          description: i.description as string | undefined,
          status: (i.status as TaskStatus) ?? 'todo',
          priority: (i.priority as TaskPriority) ?? 1,
          labels: (i.labels as string[]) ?? [],
          assigneeId: i.assigneeId as string | undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        dispatch(addTask(newTask));
        output = { success: true, task: newTask };
      } else if (tc.toolName === 'updateTask') {
        const { id, ...updates } = i as { id: string } & Partial<
          Omit<TaskRaw, 'id'>
        >;
        dispatch(reduxUpdateTask({ id, updates }));
        output = { success: true };
      } else if (tc.toolName === 'deleteTask') {
        dispatch(reduxDeleteTask(i.id as string));
        output = { success: true };
      } else if (tc.toolName === 'assignTask') {
        dispatch(
          reduxAssignTask({
            id: i.id as string,
            assigneeId: i.assigneeId as string,
          }),
        );
        output = { success: true };
      } else if (tc.toolName === 'unassignTask') {
        dispatch(
          reduxUpdateTask({
            id: i.id as string,
            updates: { assigneeId: undefined },
          }),
        );
        output = { success: true };
      } else if (tc.toolName === 'addTaskLabel') {
        dispatch(
          reduxAddTaskLabel({ id: i.id as string, label: i.label as string }),
        );
        output = { success: true };
      } else if (tc.toolName === 'removeTaskLabel') {
        dispatch(
          reduxRemoveTaskLabel({
            id: i.id as string,
            label: i.label as string,
          }),
        );
        output = { success: true };
      }

      setTimeout(() => {
        addToolOutputRef.current?.({
          tool: tc.toolName,
          toolCallId: tc.toolCallId,
          output,
        });
      }, 0);
    },
  });

  useEffect(() => {
    addToolOutputRef.current = addToolOutput;
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (input.trim() && status !== 'streaming') {
      sendMessage(
        { text: input.trim() },
        {
          body: { tasks },
        },
      );
      setInput('');
    }
  }

  function handleKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (input.trim() && status !== 'streaming') {
        handleSubmit(event);
      }
    }
  }

  return (
    <div className={cn('flex h-full min-h-0 flex-col')}>
      <MessageScrollerProvider autoScroll={true}>
        <MessageScroller className="flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-4 px-3 py-3">
              {messages.map((message) => {
                const align = message.role === 'user' ? 'end' : 'start';
                return (
                  <MessageScrollerItem key={message.id}>
                    <Message align={align}>
                      {message.role === 'assistant' && (
                        <MessageAvatar>
                          <Avatar>
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        </MessageAvatar>
                      )}
                      <MessageContent>
                        <Bubble align={align} variant={align === 'end' ? 'default' : 'muted'}>
                          <BubbleContent>
                            {message.role === 'user' ? (
                              <>
                                {message.parts?.map((part, partIndex) => {
                                  if (part.type === 'text') {
                                    return (
                                      <div
                                        key={partIndex}
                                        className="whitespace-pre-wrap">
                                        {part.text}
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </>
                            ) : (
                              <div className="flex flex-col">
                                {message.parts?.map((part, partIndex) => {
                                  if (part.type === 'text') {
                                    return (
                                      <ReactMarkdown
                                        key={partIndex}
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                          p: ({ children }) => (
                                            <p className="mb-2 last:mb-0">
                                              {children}
                                            </p>
                                          ),
                                          ul: ({ children }) => (
                                            <ul className="mb-2 list-disc pl-4 last:mb-0">
                                              {children}
                                            </ul>
                                          ),
                                          ol: ({ children }) => (
                                            <ol className="mb-2 list-decimal pl-4 last:mb-0">
                                              {children}
                                            </ol>
                                          ),
                                          li: ({ children }) => (
                                            <li className="mb-0.5">{children}</li>
                                          ),
                                          strong: ({ children }) => (
                                            <strong className="font-semibold">
                                              {children}
                                            </strong>
                                          ),
                                          code: ({ children }) => (
                                            <code className="rounded bg-black/10 px-1 py-0.5 font-mono text-xs dark:bg-white/10">
                                              {children}
                                            </code>
                                          ),
                                          pre: ({ children }) => (
                                            <pre className="mb-2 overflow-x-auto rounded bg-black/10 p-2 font-mono text-xs last:mb-0 dark:bg-white/10">
                                              {children}
                                            </pre>
                                          ),
                                        }}>
                                        {part.text}
                                      </ReactMarkdown>
                                    );
                                  }
                                  if (isToolUIPart(part)) {
                                    const toolName = getToolName(part);
                                    return (
                                      <ToolInvocationBadge
                                        key={partIndex}
                                        toolName={toolName}
                                        input={
                                          (part.input ?? {}) as Record<
                                            string,
                                            unknown
                                          >
                                        }
                                        state={part.state}
                                      />
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            )}
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                );
              })}
              {status === 'streaming' && (
                <MessageScrollerItem>
                  <Message align="start">
                    <MessageContent>
                      <Bubble variant="muted">
                        <BubbleContent>
                          <div className="flex items-center gap-1">
                            <div
                              className="size-1.5 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: '0ms' }}
                            />
                            <div
                              className="size-1.5 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: '150ms' }}
                            />
                            <div
                              className="size-1.5 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: '300ms' }}
                            />
                          </div>
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              )}
              {error && (
                <MessageScrollerItem>
                  <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg dark:bg-red-950/50">
                    Error: {error.message}
                  </div>
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <div className={cn('flex flex-col gap-2 p-2 pt-1')}>
        <form
          onSubmit={handleSubmit}
          className={cn(
            'flex items-center gap-1.5 rounded-2xl border border-input bg-card p-1.5 shadow-xs',
            'focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
            'transition-[border-color,box-shadow]',
          )}>
          <Textarea
            autoFocus={true}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything about your tasks..."
            className="min-h-10 max-h-32 flex-1 resize-none border-0 bg-transparent px-2.5 py-2 leading-tight shadow-none focus-visible:ring-0"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                disabled={!input.trim()}
                size="icon"
                aria-label="Send message"
                className="size-9 shrink-0 rounded-xl">
                <RiSendPlaneFill className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Send</span>
              <kbd className="ml-2 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                Enter
              </kbd>
            </TooltipContent>
          </Tooltip>
        </form>
      </div>
    </div>
  );
}
