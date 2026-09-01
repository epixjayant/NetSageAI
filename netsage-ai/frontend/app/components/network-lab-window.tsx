"use client";

import { useEffect, useRef, useState } from "react";

type Position = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

const MIN_WIDTH = 320;
const MIN_HEIGHT = 240;

export function NetworkLabWindow() {
  const [position, setPosition] = useState<Position>({
    x: 24,
    y: 88,
  });

  const [size, setSize] = useState<Size>({
    width: 420,
    height: 360,
  });

  const [minimized, setMinimized] = useState(false);
  const [closed, setClosed] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const resizeRef = useRef<{
    startX: number;
    startY: number;
    originWidth: number;
    originHeight: number;
  } | null>(null);

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
  }

  function handleDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;

    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;

    setPosition({
      x: Math.max(8, dragRef.current.originX + deltaX),
      y: Math.max(64, dragRef.current.originY + deltaY),
    });
  }

  function stopDrag() {
    dragRef.current = null;
  }

  function startResize(event: React.PointerEvent<HTMLDivElement>) {
    event.stopPropagation();

    if (event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    resizeRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originWidth: size.width,
      originHeight: size.height,
    };
  }

  function handleResize(event: React.PointerEvent<HTMLDivElement>) {
    if (!resizeRef.current) return;

    const deltaX = event.clientX - resizeRef.current.startX;
    const deltaY = event.clientY - resizeRef.current.startY;

    setSize({
      width: Math.max(MIN_WIDTH, resizeRef.current.originWidth + deltaX),
      height: Math.max(MIN_HEIGHT, resizeRef.current.originHeight + deltaY),
    });
  }

  function stopResize() {
    resizeRef.current = null;
  }

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setClosed(true);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (closed) {
    return (
      <button
        type='button'
        onClick={() => setClosed(false)}
        className='fixed bottom-4 left-4 z-50 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground shadow-lg transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-focus-ring'
      >
        Open Network Lab
      </button>
    );
  }

  return (
    <section
      aria-label='Network Lab'
      className='fixed z-50 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl'
      style={{
        left: position.x,
        top: position.y,
        width: minimized ? 300 : size.width,
        height: minimized ? "auto" : size.height,
      }}
    >
      {/* Window header */}
      <div
        onPointerDown={startDrag}
        onPointerMove={handleDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        className='flex h-12 cursor-grab select-none items-center justify-between border-b border-border bg-surface-muted px-3 active:cursor-grabbing'
      >
        <div className='flex min-w-0 items-center gap-2'>
          <span className='h-2 w-2 rounded-full bg-success' />

          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold'>Network Lab</p>
            <p className='hidden text-[10px] text-muted-foreground sm:block'>
              Topology workspace
            </p>
          </div>
        </div>

        <div className='flex items-center gap-1'>
          <button
            type='button'
            aria-label={
              minimized ? "Expand Network Lab" : "Minimize Network Lab"
            }
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => setMinimized((value) => !value)}
            className='flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground focus:outline-none focus:ring-2 focus:ring-focus-ring'
          >
            {minimized ? "□" : "−"}
          </button>

          <button
            type='button'
            aria-label='Close Network Lab'
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => setClosed(true)}
            className='flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-danger/10 hover:text-danger focus:outline-none focus:ring-2 focus:ring-focus-ring'
          >
            ×
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Topology */}
          <div className='h-[calc(100%-3rem)] overflow-auto p-4'>
            <div className='flex h-full min-h-[300px] flex-col'>
              <div className='mb-3 flex items-center justify-between'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                    Topology
                  </p>

                  <p className='mt-1 text-xs text-muted-foreground'>
                    Cisco / Packet Tracer lab
                  </p>
                </div>

                <span className='rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success'>
                  Connected
                </span>
              </div>

              <div className='relative flex-1 overflow-hidden rounded-xl border border-border bg-background'>
                {/* Connection lines */}
                <div className='absolute left-[23%] top-[31%] h-px w-[54%] bg-border-strong' />
                <div className='absolute left-[50%] top-[31%] h-[38%] w-px bg-border-strong' />
                <div className='absolute left-[50%] top-[69%] h-px w-[27%] bg-border-strong' />

                {/* R1 */}
                <div className='absolute left-[8%] top-[20%]'>
                  <TopologyNode name='R1' type='Router' status='online' />
                </div>

                {/* SW1 */}
                <div className='absolute left-[42%] top-[20%]'>
                  <TopologyNode name='SW1' type='Switch' status='online' />
                </div>

                {/* PC */}
                <div className='absolute right-[8%] top-[20%]'>
                  <TopologyNode name='PC-01' type='Endpoint' status='online' />
                </div>

                {/* Server */}
                <div className='absolute left-[39%] bottom-[10%]'>
                  <TopologyNode
                    name='Server-01'
                    type='Server'
                    status='online'
                  />
                </div>
              </div>

              <div className='mt-3 grid grid-cols-2 gap-2'>
                <div className='rounded-lg border border-border bg-surface-muted p-2.5'>
                  <p className='text-[10px] uppercase tracking-wider text-muted-foreground'>
                    Incident
                  </p>
                  <p className='mt-1 text-xs font-medium'>PC-01 → Server-01</p>
                </div>

                <div className='rounded-lg border border-border bg-surface-muted p-2.5'>
                  <p className='text-[10px] uppercase tracking-wider text-muted-foreground'>
                    Devices
                  </p>
                  <p className='mt-1 text-xs font-medium'>4 online</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resize handle */}
          <div
            role='separator'
            aria-label='Resize Network Lab'
            onPointerDown={startResize}
            onPointerMove={handleResize}
            onPointerUp={stopResize}
            onPointerCancel={stopResize}
            className='absolute bottom-0 right-0 h-6 w-6 cursor-se-resize touch-none'
          >
            <span className='absolute bottom-1 right-1 text-xs text-muted-foreground'>
              ⋰
            </span>
          </div>
        </>
      )}
    </section>
  );
}

function TopologyNode({
  name,
  type,
  status,
}: {
  name: string;
  type: string;
  status: "online" | "offline";
}) {
  return (
    <div className='w-20 rounded-xl border border-border bg-surface p-2 text-center shadow-sm'>
      <div className='mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-xs font-bold'>
        {name === "R1"
          ? "R"
          : name === "SW1"
            ? "S"
            : name === "PC-01"
              ? "P"
              : "▣"}
      </div>

      <p className='mt-1.5 truncate text-xs font-semibold'>{name}</p>

      <div className='mt-1 flex items-center justify-center gap-1'>
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            status === "online" ? "bg-success" : "bg-danger"
          }`}
        />
        <span className='text-[9px] text-muted-foreground'>{type}</span>
      </div>
    </div>
  );
}
