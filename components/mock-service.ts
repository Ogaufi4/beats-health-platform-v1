type Facility = {
  id: string;
  facility: string;
  location?: string;
  distance?: number;
  stock: Record<string, number>;
  equipment: Record<string, "available" | "busy" | "maintenance">;
  specialists: Record<string, "available" | "busy" | "off-duty">;
  mapUrl?: string;
};

type Task = {
  id: string;
  type:
    | "transfer_request"
    | "booking_request"
    | "specialist_request"
    | "stock_update";
  fromFacility: string;
  toFacility: string;
  payload: any;
  createdAt: string;
  status: "pending" | "approved" | "in-transit" | "fulfilled" | "cancelled";
};

const STORAGE_KEYS = {
  FACILITIES: "mock:facilities",
  TASKS: "mock:tasks",
};

const defaultFacilities: Facility[] = [
  {
    id: "pmh",
    facility: "Princess Marina Hospital",
    location: "Gaborone",
    distance: 2.1,
    stock: { paracetamol: 120, amoxicillin: 30, ibuprofen: 50, insulin: 45 },
    equipment: {
      "MRI Scanner": "available",
      "CT Scanner": "busy",
      "X-Ray Machine": "available",
    },
    specialists: {
      Cardiologist: "available",
      Radiographer: "busy",
      Dentist: "available",
    },
    mapUrl: "https://maps.google.com/?q=Princess+Marina+Hospital",
  },
  {
    id: "skmth",
    facility: "Sir Ketumile Masire Hospital",
    location: "Gaborone",
    distance: 5.4,
    stock: { insulin: 120, amoxicillin: 240, paracetamol: 80 },
    equipment: { Ultrasound: "available", "MRI Scanner": "busy" },
    specialists: { Cardiologist: "available", Oncologist: "available" },
    mapUrl: "https://maps.google.com/?q=Sir+Ketumile+Masire+Teaching+Hospital",
  },
  {
    id: "ub_clinic",
    facility: "UB Clinic",
    location: "Gaborone",
    distance: 3.2,
    stock: { insulin: 5, paracetamol: 40 },
    equipment: { Ultrasound: "available" },
    specialists: { "General Practitioner": "available", Nurse: "available" },
  },
  {
    id: "bdf_clinic",
    facility: "BDF Clinic",
    location: "Mogoditshane",
    distance: 8.1,
    stock: { paracetamol: 100 },
    equipment: { "X-Ray Machine": "available" },
    specialists: { Dentist: "available", Nurse: "available" },
  },
];

const evtTarget = new EventTarget();

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, data: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function initMock() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(STORAGE_KEYS.FACILITIES)) {
    write(STORAGE_KEYS.FACILITIES, defaultFacilities);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    write(STORAGE_KEYS.TASKS, []);
  }
}

/** Simulate network latency */
function delay<T>(result: T, ms = 500): Promise<T> {
  return new Promise((res) =>
    setTimeout(() => res(result), ms + Math.random() * 300),
  );
}

/** Facilities / stock */
export async function getFacilities(): Promise<Facility[]> {
  initMock();
  const f = read<Facility[]>(STORAGE_KEYS.FACILITIES, defaultFacilities);
  return delay(f);
}

export async function updateStock(
  facilityId: string,
  medicine: string,
  delta: number,
): Promise<Facility | null> {
  initMock();
  const facilities = read<Facility[]>(
    STORAGE_KEYS.FACILITIES,
    defaultFacilities,
  );
  const found = facilities.find((f) => f.id === facilityId);
  if (!found) return delay(null);
  const cur = found.stock[medicine] ?? 0;
  found.stock[medicine] = Math.max(0, cur + delta);
  write(STORAGE_KEYS.FACILITIES, facilities);
  evtTarget.dispatchEvent(
    new CustomEvent("facilities:changed", { detail: found }),
  );
  return delay(found);
}

export async function findMedicine(query: string): Promise<any[]> {
  initMock();
  const q = query.trim().toLowerCase();
  const facilities = read<Facility[]>(
    STORAGE_KEYS.FACILITIES,
    defaultFacilities,
  );
  const results: any[] = [];

  facilities.forEach((f) => {
    Object.entries(f.stock).forEach(([med, qty]) => {
      if (med.toLowerCase().includes(q)) {
        results.push({
          facilityId: f.id,
          facilityName: f.facility,
          item: med,
          status: qty > 0 ? "In Stock" : "Out of Stock",
          qty,
          location: f.location,
        });
      }
    });
  });

  return delay(results);
}

export async function findEquipment(query: string): Promise<any[]> {
  initMock();
  const q = query.trim().toLowerCase();
  const facilities = read<Facility[]>(
    STORAGE_KEYS.FACILITIES,
    defaultFacilities,
  );
  const results: any[] = [];

  facilities.forEach((f) => {
    Object.entries(f.equipment).forEach(([name, status]) => {
      if (name.toLowerCase().includes(q)) {
        results.push({
          facilityId: f.id,
          facilityName: f.facility,
          item: name,
          status:
            status === "available"
              ? "Available"
              : status === "busy"
                ? "Busy"
                : "Maintenance",
          qty: 1, // typically one machine per clinic in this mock
          location: f.location,
        });
      }
    });
  });

  return delay(results);
}

export async function findSpecialists(query: string): Promise<any[]> {
  initMock();
  const q = query.trim().toLowerCase();
  const facilities = read<Facility[]>(
    STORAGE_KEYS.FACILITIES,
    defaultFacilities,
  );
  const results: any[] = [];

  facilities.forEach((f) => {
    Object.entries(f.specialists).forEach(([name, status]) => {
      if (name.toLowerCase().includes(q)) {
        results.push({
          facilityId: f.id,
          facilityName: f.facility,
          item: name,
          status:
            status === "available"
              ? "On Duty"
              : status === "busy"
                ? "Busy"
                : "Off Duty",
          qty: 1,
          location: f.location,
        });
      }
    });
  });

  return delay(results);
}

/** Tasks - used for transfers and bookings */
export async function getTasks(): Promise<Task[]> {
  initMock();
  const t = read<Task[]>(STORAGE_KEYS.TASKS, []);
  return delay(t, 300);
}

export async function addTask(
  task: Omit<Task, "id" | "createdAt" | "status">,
): Promise<Task> {
  initMock();
  const tasks = read<Task[]>(STORAGE_KEYS.TASKS, []);
  const newT: Task = {
    id: "t_" + Date.now().toString(36),
    createdAt: new Date().toISOString(),
    status: "pending",
    ...task,
  };
  tasks.unshift(newT);
  write(STORAGE_KEYS.TASKS, tasks);
  evtTarget.dispatchEvent(new CustomEvent("tasks:added", { detail: newT }));
  return delay(newT, 500);
}

export async function updateTaskStatus(
  taskId: string,
  status: Task["status"],
): Promise<Task | null> {
  initMock();
  const tasks = read<Task[]>(STORAGE_KEYS.TASKS, []);
  const found = tasks.find((t) => t.id === taskId);
  if (!found) return delay(null);

  found.status = status;
  write(STORAGE_KEYS.TASKS, tasks);
  evtTarget.dispatchEvent(new CustomEvent("tasks:updated", { detail: found }));
  return delay(found);
}

export function subscribe(
  event: "tasks:added" | "tasks:updated" | "facilities:changed",
  cb: (detail: any) => void,
) {
  const handler = (ev: Event) => cb((ev as CustomEvent).detail);
  evtTarget.addEventListener(event, handler);
  return () => evtTarget.removeEventListener(event, handler);
}
