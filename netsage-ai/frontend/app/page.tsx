"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./components/theme-toggle";

type DevicePosition = {
  x: number;
  y: number;
};

type LinkState = "healthy" | "warning" | "down" | "unknown";

const devices = [
  {
    name: "R1",
    type: "Router",
    status: "Online",
    details: [
      ["Gi0/0", "192.168.10.1", "up/up"],
      ["Gi0/1", "192.168.30.1", "up/up"],
    ],
  },
  {
    name: "SW1",
    type: "Switch",
    status: "Online",
    details: [
      ["VLAN 10", "192.168.10.0/24", "active"],
      ["VLAN 30", "192.168.30.0/24", "active"],
    ],
  },
  {
    name: "PC-01",
    type: "Endpoint",
    status: "Online",
    details: [
      ["IP Address", "192.168.10.20", ""],
      ["Subnet Mask", "255.255.255.0", ""],
      ["Gateway", "192.168.10.1", ""],
    ],
  },
  {
    name: "Server-01",
    type: "Server",
    status: "Online",
    details: [
      ["IP Address", "192.168.30.50", ""],
      ["Subnet Mask", "255.255.255.0", ""],
      ["Gateway", "192.168.30.1", ""],
    ],
  },
];

const initialPositions: Record<string, DevicePosition> = {
  R1: { x: 14, y: 24 },
  SW1: { x: 50, y: 24 },
  "PC-01": { x: 86, y: 24 },
  "Server-01": { x: 50, y: 73 },
};

const links: {
  id: string;
  from: string;
  to: string;
  state: LinkState;
  label: string;
}[] = [
  {
    id: "r1-sw1",
    from: "R1",
    to: "SW1",
    state: "healthy",
    label: "Operational",
  },
  {
    id: "sw1-pc01",
    from: "SW1",
    to: "PC-01",
    state: "healthy",
    label: "Operational",
  },
  {
    id: "sw1-server01",
    from: "SW1",
    to: "Server-01",
    state: "warning",
    label: "Needs verification",
  },
];

const evidence = [
  { label: "Gateway reachable", state: "confirmed" },
  { label: "Interface operational", state: "confirmed" },
  { label: "Destination route", state: "pending" },
];

const investigationSteps = [
  { number: "01", label: "Symptom received", state: "complete" },
  { number: "02", label: "Initial evidence collected", state: "complete" },
  { number: "03", label: "Next command recommended", state: "current" },
  { number: "04", label: "Diagnosis", state: "pending" },
  { number: "05", label: "Human review", state: "pending" },
];

const SNAP_DISTANCE = 9;

export default function Home() {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const topologyRef = useRef<HTMLDivElement>(null);

  const [labWidth, setLabWidth] = useState(36);
  const [resizing, setResizing] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const incidentDevices = ["PC-01", "Server-01"];
  const suspectedDevices = ["SW1"];
  const incidentLinks = ["sw1-server01"];

  const [zoom, setZoom] = useState(1);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">(
    "checking",
  );
  const [ruleStatus, setRuleStatus] = useState<
    "idle" | "checking" | "complete" | "error"
  >("idle");
  const [commandOutput, setCommandOutput] = useState("");

  const [ruleResult, setRuleResult] = useState<{
    rule_id: string;
    severity: string;
    status: string;
    message: string;
    evidence?: Record<string, unknown>;
  } | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);

  const panStartRef = useRef({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });

  useEffect(() => {
    let cancelled = false;

    async function checkApi() {
      try {
        const response = await fetch("http://127.0.0.1:8000/health", {
          cache: "no-store",
        });

        if (!cancelled) {
          setApiStatus(response.ok ? "online" : "offline");
        }
      } catch {
        if (!cancelled) {
          setApiStatus("offline");
        }
      }
    }

    checkApi();

    return () => {
      cancelled = true;
    };
  }, []);

  const [positions, setPositions] =
    useState<Record<string, DevicePosition>>(initialPositions);

  const [draggingDevice, setDraggingDevice] = useState<string | null>(null);
  const [snapTarget, setSnapTarget] = useState<string | null>(null);

  function zoomIn() {
    setZoom((current) => Math.min(1.6, Number((current + 0.1).toFixed(1))));
  }

  function zoomOut() {
    setZoom((current) => Math.max(0.7, Number((current - 0.1).toFixed(1))));
  }

  function fitTopology() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }
  async function runGatewayCheck() {
    setRuleStatus("checking");
    setRuleResult(null);

    const lines = commandOutput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const evidence: Record<string, string> = {};

    for (const line of lines) {
      const separator = line.indexOf(":");

      if (separator === -1) continue;

      const key = line.slice(0, separator).trim().toLowerCase();

      const value = line.slice(separator + 1).trim();

      if (key === "ip") {
        evidence.ip_address = value;
      }

      if (key === "subnet mask") {
        evidence.subnet_mask = value;
      }

      if (key === "gateway") {
        evidence.gateway = value;
      }
    }

    if (!evidence.ip_address || !evidence.subnet_mask || !evidence.gateway) {
      setRuleStatus("error");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/rules/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rule_id: "GATEWAY_MISMATCH",
          evidence,
        }),
      });

      if (!response.ok) {
        throw new Error("Rule check failed");
      }

      const result = await response.json();

      setRuleResult(result);
      setRuleStatus("complete");
    } catch {
      setRuleStatus("error");
    }
  }

  function resetTopologyLayout() {
    setPositions(initialPositions);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedDevice(null);
    setSnapTarget(null);
  }

  function getDeviceIncidentState(deviceName: string) {
    if (incidentDevices.includes(deviceName)) {
      return "affected";
    }

    if (suspectedDevices.includes(deviceName)) {
      return "suspected";
    }

    return "normal";
  }

  function startPan(event: React.PointerEvent<HTMLDivElement>) {
    if (draggingDevice) return;

    event.preventDefault();

    panStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    setPanning(true);
  }

  function movePan(event: React.PointerEvent<HTMLDivElement>) {
    if (!panning) return;

    const deltaX = event.clientX - panStartRef.current.x;
    const deltaY = event.clientY - panStartRef.current.y;

    setPan({
      x: panStartRef.current.panX + deltaX,
      y: panStartRef.current.panY + deltaY,
    });
  }

  function stopPan() {
    setPanning(false);
  }

  function startResize(event: React.PointerEvent<HTMLButtonElement>) {
    if (window.innerWidth < 1024) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setResizing(true);
  }

  function resize(event: React.PointerEvent<HTMLButtonElement>) {
    if (!resizing || !workspaceRef.current) return;

    const rect = workspaceRef.current.getBoundingClientRect();
    const width = ((event.clientX - rect.left) / rect.width) * 100;

    setLabWidth(Math.min(55, Math.max(28, width)));
  }

  function stopResize() {
    setResizing(false);
  }

  function handleDeviceDragStart(
    event: React.PointerEvent<HTMLButtonElement>,
    deviceName: string,
  ) {
    event.preventDefault();

    setDraggingDevice(deviceName);
    setSelectedDevice(deviceName);

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleDeviceDrag(
    event: React.PointerEvent<HTMLButtonElement>,
    deviceName: string,
  ) {
    if (draggingDevice !== deviceName || !topologyRef.current) return;

    const rect = topologyRef.current.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.min(94, Math.max(6, x));
    const clampedY = Math.min(88, Math.max(10, y));

    let nearestDevice: string | null = null;
    let nearestDistance = SNAP_DISTANCE;

    Object.entries(positions).forEach(([name, position]) => {
      if (name === deviceName) return;

      const distance = Math.hypot(clampedX - position.x, clampedY - position.y);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestDevice = name;
      }
    });

    setSnapTarget(nearestDevice);

    setPositions((current) => ({
      ...current,
      [deviceName]: {
        x: clampedX,
        y: clampedY,
      },
    }));
  }

  function handleDeviceDragEnd(deviceName: string) {
    setPositions((current) => {
      const currentPosition = current[deviceName];

      if (!currentPosition || !snapTarget) {
        return current;
      }

      const targetPosition = current[snapTarget];

      if (!targetPosition) {
        return current;
      }

      return {
        ...current,
        [deviceName]: {
          x: targetPosition.x,
          y: targetPosition.y,
        },
      };
    });

    setSnapTarget(null);
    setDraggingDevice(null);
  }

  const selectedDeviceData = devices.find(
    (device) => device.name === selectedDevice,
  );

  return (
    <main className='min-h-screen bg-background text-foreground'>
      {/* HEADER */}
      <header className='sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur'>
        <div className='mx-auto flex min-h-16 max-w-[1800px] items-center justify-between px-4 sm:px-6 lg:px-8'>
          <div className='flex min-w-0 items-center gap-3'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent font-bold text-accent-foreground'>
              N
            </div>

            <div className='min-w-0'>
              <h1 className='truncate text-sm font-semibold sm:text-base'>
                NetSage AI
              </h1>

              <p className='hidden text-xs text-muted-foreground sm:block'>
                Network Troubleshooting Copilot
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div
              className={`hidden items-center gap-2 text-sm sm:flex ${
                apiStatus === "online"
                  ? "text-success"
                  : apiStatus === "offline"
                    ? "text-danger"
                    : "text-muted-foreground"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  apiStatus === "online"
                    ? "bg-success"
                    : apiStatus === "offline"
                      ? "bg-danger"
                      : "bg-muted-foreground"
                }`}
              />

              {apiStatus === "online"
                ? "API Ready"
                : apiStatus === "offline"
                  ? "API Offline"
                  : "Checking API"}
            </div>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* RESPONSIVE TWO-PANE WORKSPACE */}
      <div
        ref={workspaceRef}
        className='mx-auto grid max-w-[1800px] grid-cols-1 lg:min-h-[calc(100vh-4rem)]'
        style={{
          gridTemplateColumns: `minmax(0, ${labWidth}%) 8px minmax(0, ${
            100 - labWidth
          }%)`,
        }}
      >
        {/* =========================================================
            LEFT — NETWORK LAB
        ========================================================= */}
        <section className='min-w-0 border-b border-border bg-surface lg:border-b-0'>
          <div className='p-4 sm:p-6 lg:p-7'>
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0'>
                <p className='text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
                  Network / Lab
                </p>

                <h2 className='mt-1 text-lg font-semibold'>
                  Topology workspace
                </h2>

                <p className='mt-1 text-sm leading-5 text-muted-foreground'>
                  Inspect and arrange the network while NetSage guides the
                  investigation.
                </p>
              </div>

              <span className='shrink-0 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success'>
                Connected
              </span>
            </div>

            {/* TOPOLOGY */}
            <div className='mt-6 overflow-hidden rounded-2xl border border-border bg-background'>
              {/* TOOLBAR */}
              <div className='flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                    Topology
                  </p>

                  <div className='mt-1 flex flex-wrap items-center gap-2'>
                    <p className='text-[11px] text-muted-foreground'>
                      NetSageAI Packet Tracer lab
                    </p>

                    <span className='rounded-full border border-border bg-surface-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground'>
                      Interactive
                    </span>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='flex items-center overflow-hidden rounded-lg border border-border bg-surface'>
                    <button
                      type='button'
                      onClick={zoomOut}
                      disabled={zoom <= 0.7}
                      aria-label='Zoom out'
                      className='flex h-8 w-8 items-center justify-center text-sm font-medium text-muted-foreground transition hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40'
                    >
                      −
                    </button>

                    <span className='flex h-8 min-w-14 items-center justify-center border-x border-border px-2 font-mono text-[11px] text-muted-foreground'>
                      {Math.round(zoom * 100)}%
                    </span>

                    <button
                      type='button'
                      onClick={zoomIn}
                      disabled={zoom >= 1.6}
                      aria-label='Zoom in'
                      className='flex h-8 w-8 items-center justify-center text-sm font-medium text-muted-foreground transition hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40'
                    >
                      +
                    </button>
                  </div>

                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      onClick={fitTopology}
                      className='flex h-8 items-center rounded-lg border border-border bg-surface px-3 text-[11px] font-medium text-muted-foreground transition hover:bg-surface-muted hover:text-foreground'
                    >
                      Fit
                    </button>

                    <button
                      type='button'
                      onClick={() => setPan({ x: 0, y: 0 })}
                      className='hidden h-8 items-center rounded-lg border border-border bg-surface px-3 text-[11px] font-medium text-muted-foreground transition hover:bg-surface-muted hover:text-foreground sm:flex'
                    >
                      Center
                    </button>

                    <button
                      type='button'
                      onClick={resetTopologyLayout}
                      className='hidden h-8 items-center rounded-lg border border-border bg-surface px-3 text-[11px] font-medium text-muted-foreground transition hover:bg-surface-muted hover:text-foreground md:flex'
                    >
                      Reset
                    </button>
                  </div>

                  <span className='hidden font-mono text-[11px] text-muted-foreground xl:block'>
                    LAB-001
                  </span>
                </div>
              </div>

              {/* TOPOLOGY CANVAS */}
              <div
                ref={topologyRef}
                className={`relative min-h-[420px] overflow-hidden bg-background sm:min-h-[500px] ${
                  panning ? "cursor-grabbing" : "cursor-grab"
                }`}
                onPointerDown={startPan}
                onPointerMove={movePan}
                onPointerUp={stopPan}
                onPointerCancel={stopPan}
              >
                {/* GRID */}
                <div
                  className='pointer-events-none absolute inset-0 opacity-60'
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />

                {/* ZOOMED CONTENT */}
                <div
                  className='absolute inset-0 origin-center transition-transform duration-200'
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  }}
                >
                  {/* CONNECTIONS */}
                  {links.map((link) => (
                    <TopologyConnection
                      key={link.id}
                      from={positions[link.from]}
                      to={positions[link.to]}
                      state={link.state}
                      label={link.label}
                      incident={incidentLinks.includes(link.id)}
                    />
                  ))}
                  {/* SNAP TARGET */}
                  {snapTarget && positions[snapTarget] && (
                    <div
                      className='pointer-events-none absolute z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-dashed border-accent/60 bg-accent/5 transition-all'
                      style={{
                        left: `${positions[snapTarget].x}%`,
                        top: `${positions[snapTarget].y}%`,
                      }}
                    >
                      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-accent px-2 py-1 text-[9px] font-medium text-accent-foreground shadow-sm'>
                        Snap to {snapTarget}
                      </div>
                    </div>
                  )}

                  {/* DEVICES */}
                  {devices.map((device) => {
                    const position = positions[device.name];

                    return (
                      <div
                        key={device.name}
                        className='absolute'
                        style={{
                          left: `${position.x}%`,
                          top: `${position.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <TopologyNode
                          name={device.name}
                          type={device.type}
                          selected={selectedDevice === device.name}
                          dragging={draggingDevice === device.name}
                          incidentState={getDeviceIncidentState(device.name)}
                          onPointerDown={(event) =>
                            handleDeviceDragStart(event, device.name)
                          }
                          onPointerMove={(event) =>
                            handleDeviceDrag(event, device.name)
                          }
                          onPointerUp={() => handleDeviceDragEnd(device.name)}
                          onPointerCancel={() =>
                            handleDeviceDragEnd(device.name)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
                {/* LEGEND */}
                <div className='pointer-events-none absolute bottom-3 right-3 hidden rounded-lg border border-border bg-surface/90 px-3 py-2 text-[10px] text-muted-foreground shadow-sm backdrop-blur sm:block'>
                  <div className='flex items-center gap-3'>
                    <span className='flex items-center gap-1.5'>
                      <span className='h-2 w-2 rounded-full bg-success' />
                      Healthy
                    </span>

                    <span className='flex items-center gap-1.5'>
                      <span className='h-2 w-2 rounded-full bg-warning' />
                      Warning
                    </span>

                    <span className='flex items-center gap-1.5'>
                      <span className='h-2 w-2 rounded-full bg-danger' />
                      Affected
                    </span>
                  </div>
                </div>
                {/* CANVAS STATUS */}
                <div className='pointer-events-none absolute bottom-3 left-3 rounded-lg border border-border bg-surface/90 px-3 py-1.5 text-[10px] text-muted-foreground backdrop-blur'>
                  Drag to move • Drag empty space to pan
                </div>
              </div>
            </div>

            {/* DEVICES */}
            <div className='mt-5 flex items-center justify-between'>
              <p className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                Devices
              </p>

              <span className='text-xs text-muted-foreground'>
                {devices.length} online
              </span>
            </div>

            {selectedDeviceData && (
              <DeviceDetailsPanel
                device={selectedDeviceData}
                onClose={() => setSelectedDevice(null)}
              />
            )}

            <div className='mt-3 grid grid-cols-2 gap-2'>
              {devices.map((device) => (
                <button
                  key={device.name}
                  type='button'
                  className={`min-w-0 rounded-xl border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-focus-ring ${
                    selectedDevice === device.name
                      ? "border-accent bg-accent/10"
                      : "border-border bg-background hover:bg-surface-muted"
                  }`}
                  onClick={() => setSelectedDevice(device.name)}
                >
                  <div className='flex min-w-0 items-center gap-2'>
                    <span className='h-2 w-2 shrink-0 rounded-full bg-success' />

                    <span className='truncate text-sm font-medium'>
                      {device.name}
                    </span>
                  </div>

                  <p className='mt-1 truncate text-xs text-muted-foreground'>
                    {device.type}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            RESIZABLE SPLITTER
        ========================================================= */}
        <button
          type='button'
          aria-label='Resize Network Lab and Troubleshooting Copilot'
          onPointerDown={startResize}
          onPointerMove={resize}
          onPointerUp={stopResize}
          onPointerCancel={stopResize}
          className={`group relative hidden touch-none cursor-col-resize border-x border-border bg-surface-muted transition-colors hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-focus-ring lg:block ${
            resizing ? "bg-accent/10" : ""
          }`}
        >
          <span className='absolute left-1/2 top-1/2 flex h-14 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-xs text-muted-foreground shadow-sm transition-colors group-hover:text-accent'>
            ⋮
          </span>
        </button>

        {/* =========================================================
            RIGHT — TROUBLESHOOTING COPILOT
        ========================================================= */}
        <section className='min-w-0 bg-background'>
          <div className='mx-auto max-w-5xl space-y-5 p-4 sm:p-6 lg:p-7 xl:p-8'>
            {/* TITLE */}
            <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.16em] text-accent'>
                  Active incident
                </p>

                <h2 className='mt-1 text-xl font-semibold tracking-tight sm:text-2xl'>
                  Troubleshooting Copilot
                </h2>
              </div>

              <span className='w-fit rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning'>
                Investigation in progress
              </span>
            </div>

            {/* INCIDENT */}
            <section className='rounded-2xl border border-border bg-surface shadow-sm'>
              <div className='border-b border-border px-4 py-4 sm:px-6'>
                <p className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                  Incident
                </p>

                <div className='mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                  <p className='text-base font-medium sm:text-lg'>
                    PC-01 cannot reach Server-01
                  </p>

                  <span className='font-mono text-xs text-muted-foreground'>
                    INC-001
                  </span>
                </div>
              </div>

              <div className='px-4 py-5 sm:px-6'>
                <div className='flex gap-3'>
                  <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent'>
                    AI
                  </div>

                  <div className='min-w-0'>
                    <p className='text-sm font-semibold'>NetSage</p>

                    <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                      I need additional evidence before making a diagnosis.
                      Based on the current information, routing or an access
                      control issue may be involved.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* NEXT COMMAND */}
            <section className='rounded-2xl border border-border bg-surface shadow-sm'>
              <div className='flex flex-col gap-4 p-4 sm:p-6'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                      Suggested next command
                    </p>

                    <div className='mt-3 overflow-x-auto rounded-xl border border-border bg-code-background px-4 py-3'>
                      <code className='whitespace-nowrap font-mono text-sm text-code-foreground'>
                        show ip interface brief
                      </code>
                    </div>
                  </div>

                  <button
                    type='button'
                    onClick={runGatewayCheck}
                    className='w-full shrink-0 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-focus-ring sm:w-auto'
                  >
                    Run command
                  </button>
                </div>

                <div className='rounded-xl bg-surface-muted p-4'>
                  <p className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                    Why this command?
                  </p>

                  <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                    We need to confirm whether the relevant interfaces are
                    operational before narrowing the investigation to routing or
                    ACL configuration.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor='command-output'
                    className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'
                  >
                    Command output
                  </label>

                  <textarea
                    id='command-output'
                    rows={6}
                    value={commandOutput}
                    onChange={(event) => setCommandOutput(event.target.value)}
                    placeholder='Paste Cisco command output here...'
                    className='mt-2 w-full resize-y rounded-xl border border-border bg-background p-4 font-mono text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-focus-ring/30'
                  />

                  <div className='mt-2 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
                    <span>
                      Enter evidence as IP, Subnet Mask, and Gateway values.
                      Cisco output parsing comes next.
                    </span>

                    <button
                      type='button'
                      className='w-fit font-medium text-accent hover:underline'
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* EVIDENCE + INVESTIGATION */}
            <div className='grid gap-5 md:grid-cols-2'>
              {/* EVIDENCE */}
              <section className='rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6'>
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                      Evidence
                    </p>

                    <h3 className='mt-1 font-semibold'>Current observations</h3>
                  </div>

                  <span className='shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-xs text-muted-foreground'>
                    {
                      evidence.filter((item) => item.state === "confirmed")
                        .length
                    }{" "}
                    confirmed
                  </span>
                </div>

                <div className='mt-5 space-y-3'>
                  {evidence.map((item) => (
                    <div
                      key={item.label}
                      className='flex items-start gap-3 rounded-xl border border-border p-3'
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          item.state === "confirmed"
                            ? "bg-success/10 text-success"
                            : "bg-surface-muted text-muted-foreground"
                        }`}
                      >
                        {item.state === "confirmed" ? "✓" : "?"}
                      </span>

                      <div className='min-w-0'>
                        <p className='text-sm font-medium'>{item.label}</p>

                        <p className='mt-0.5 text-xs text-muted-foreground'>
                          {item.state === "confirmed"
                            ? "Supported by supplied evidence"
                            : "Evidence still required"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {ruleStatus === "checking" && (
                  <div className='mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4'>
                    <p className='text-xs font-semibold uppercase tracking-[0.14em] text-accent'>
                      Deterministic verification
                    </p>

                    <p className='mt-2 text-sm text-muted-foreground'>
                      NetSage is checking the supplied evidence against the
                      Python rule engine...
                    </p>
                  </div>
                )}

                {ruleStatus === "complete" && ruleResult && (
                  <div className='mt-4 rounded-xl border border-border bg-background p-4'>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <p className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                          Deterministic verification
                        </p>

                        <p className='mt-1 font-mono text-sm font-semibold'>
                          {ruleResult.rule_id}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          ruleResult.status === "PASS"
                            ? "bg-success/10 text-success"
                            : ruleResult.status === "FAIL"
                              ? "bg-danger/10 text-danger"
                              : "bg-surface-muted text-muted-foreground"
                        }`}
                      >
                        {ruleResult.status}
                      </span>
                    </div>

                    <p className='mt-3 text-sm leading-6 text-muted-foreground'>
                      {ruleResult.message}
                    </p>
                  </div>
                )}

                {ruleStatus === "error" && (
                  <div className='mt-4 rounded-xl border border-danger/30 bg-danger/5 p-4'>
                    <p className='text-xs font-semibold uppercase tracking-[0.14em] text-danger'>
                      Verification error
                    </p>

                    <p className='mt-2 text-sm text-muted-foreground'>
                      NetSage could not reach the deterministic rule engine.
                    </p>
                  </div>
                )}
              </section>

              {/* INVESTIGATION */}
              <section className='rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6'>
                <p className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                  Investigation
                </p>

                <h3 className='mt-1 font-semibold'>Troubleshooting state</h3>

                <div className='mt-5 space-y-1'>
                  {investigationSteps.map((step) => (
                    <div
                      key={step.number}
                      className='flex items-center gap-3 rounded-xl px-3 py-2.5'
                    >
                      <span
                        className={`font-mono text-xs ${
                          step.state === "current"
                            ? "text-accent"
                            : step.state === "complete"
                              ? "text-success"
                              : "text-muted-foreground"
                        }`}
                      >
                        {step.number}
                      </span>

                      <span
                        className={`min-w-0 text-sm ${
                          step.state === "current"
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>

                      {step.state === "complete" && (
                        <span className='ml-auto text-xs text-success'>
                          Done
                        </span>
                      )}

                      {step.state === "current" && (
                        <span className='ml-auto shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent'>
                          Current
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* HUMAN REVIEW */}
            <section className='rounded-2xl border border-dashed border-border bg-surface p-4 sm:p-6'>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
                    Human review
                  </p>

                  <h3 className='mt-1 font-semibold'>
                    Diagnosis approval will appear here
                  </h3>

                  <p className='mt-1 max-w-2xl text-sm leading-6 text-muted-foreground'>
                    NetSage will never silently accept an AI remediation.
                    Diagnosis and fixes remain recommendations until reviewed by
                    the network engineer.
                  </p>
                </div>

                <span className='w-fit shrink-0 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs text-muted-foreground'>
                  Pending diagnosis
                </span>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function TopologyNode({
  name,
  type,
  selected,
  dragging,
  incidentState,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: {
  name: string;
  type: string;

  selected: boolean;
  dragging: boolean;
  incidentState: "normal" | "affected" | "suspected";
  onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
}) {
  return (
    <button
      type='button'
      onPointerDown={(event) => {
        event.stopPropagation();
        onPointerDown(event);
      }}
      onPointerMove={(event) => {
        event.stopPropagation();
        onPointerMove(event);
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        onPointerUp();
      }}
      onPointerCancel={(event) => {
        event.stopPropagation();
        onPointerCancel();
      }}
      aria-pressed={selected}
      aria-label={`Select and drag ${name} ${type}`}
      className={`w-24 select-none touch-none rounded-xl border p-2.5 text-center shadow-sm transition-all sm:w-28 ${
        dragging
          ? "z-30 scale-105 cursor-grabbing border-accent bg-accent/10 shadow-lg ring-2 ring-accent/20"
          : selected
            ? "z-20 cursor-grab border-accent bg-accent/10 shadow-md ring-2 ring-accent/20"
            : incidentState === "affected"
              ? "z-20 cursor-grab border-danger/60 bg-danger/10 shadow-md ring-2 ring-danger/20"
              : incidentState === "suspected"
                ? "z-20 cursor-grab border-warning/60 bg-warning/10 shadow-md ring-2 ring-warning/20"
                : "cursor-grab border-border bg-surface hover:border-accent/50 hover:bg-surface-muted"
      }`}
    >
      <div
        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
          selected
            ? "bg-accent text-accent-foreground"
            : "bg-surface-muted text-foreground"
        }`}
      >
        {name === "R1"
          ? "R"
          : name === "SW1"
            ? "S"
            : name === "PC-01"
              ? "P"
              : "▣"}
      </div>

      <p className='mt-1.5 truncate text-xs font-semibold'>{name}</p>
      {incidentState !== "normal" && (
        <span
          className={`mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide ${
            incidentState === "affected"
              ? "bg-danger/10 text-danger"
              : "bg-warning/10 text-warning"
          }`}
        >
          {incidentState === "affected" ? "Affected" : "Suspected"}
        </span>
      )}

      <div className='mt-1 flex items-center justify-center gap-1'>
        <span className='h-1.5 w-1.5 rounded-full bg-success' />

        <span className='text-[9px] text-muted-foreground'>{type}</span>
      </div>
    </button>
  );
}

function TopologyConnection({
  from,
  to,
  state,
  label,
  incident = false,
}: {
  from: DevicePosition;
  to: DevicePosition;
  state: LinkState;
  label: string;
  incident?: boolean;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const stateClasses: Record<LinkState, string> = {
    healthy: "bg-success",
    warning: "bg-warning",
    down: "bg-danger",
    unknown: "bg-muted-foreground",
  };

  const dotClasses: Record<LinkState, string> = {
    healthy: "bg-success",
    warning: "bg-warning",
    down: "bg-danger",
    unknown: "bg-muted-foreground",
  };

  return (
    <div
      className='pointer-events-none absolute left-0 top-0'
      style={{
        left: `${from.x}%`,
        top: `${from.y}%`,
        width: `${length}%`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: "0 50%",
      }}
      title={label}
      aria-label={`Connection status: ${label}`}
    >
      <div
        className={`relative h-px w-full ${stateClasses[state]} ${
          incident ? "h-[3px] opacity-100" : "opacity-80"
        }`}
      >
        <span
          className={`absolute left-1/2 top-1/2 rounded-full ${
            incident ? "h-3 w-3" : "h-2 w-2"
          } -translate-x-1/2 -translate-y-1/2 ${dotClasses[state]} ring-2 ring-background`}
        />
      </div>
    </div>
  );
}

function DeviceDetailsPanel({
  device,
  onClose,
}: {
  device: {
    name: string;
    type: string;
    status: string;
    details: string[][];
  };
  onClose: () => void;
}) {
  return (
    <div className='mt-4 overflow-hidden rounded-2xl border border-accent/30 bg-background shadow-sm'>
      <div className='flex items-start justify-between gap-4 border-b border-border px-4 py-4'>
        <div className='min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='h-2 w-2 rounded-full bg-success' />

            <h3 className='text-sm font-semibold'>{device.name}</h3>

            <span className='rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success'>
              {device.status}
            </span>
          </div>

          <p className='mt-1 text-xs text-muted-foreground'>{device.type}</p>
        </div>

        <button
          type='button'
          onClick={onClose}
          aria-label={`Close ${device.name} details`}
          className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-focus-ring'
        >
          ×
        </button>
      </div>

      <div className='p-4'>
        <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
          Device information
        </p>

        <div className='mt-3 overflow-hidden rounded-xl border border-border'>
          {device.details.map(([label, value, state], index) => (
            <div
              key={`${label}-${value}`}
              className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] items-center gap-3 px-3 py-2.5 text-xs ${
                index !== device.details.length - 1
                  ? "border-b border-border"
                  : ""
              }`}
            >
              <span className='truncate text-muted-foreground'>{label}</span>

              <span className='truncate font-mono text-foreground'>
                {value}
              </span>

              {state ? (
                <span className='rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success'>
                  {state}
                </span>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
