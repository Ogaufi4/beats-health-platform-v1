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
    | "stock_update"
    | "patient_referral"
    | "supply_order";
  fromFacility: string;
  toFacility: string;
  payload: any;
  createdAt: string;
  status: "pending" | "approved" | "in-transit" | "fulfilled" | "cancelled";
};

const STORAGE_KEYS = {
  FACILITIES: "mock:facilities",
  TASKS: "mock:tasks",
  PATIENTS: "mock:patients",
};

const defaultTasks: Task[] = [
  {
    id: "t_seed_1",
    type: "transfer_request",
    fromFacility: "ub_clinic",
    toFacility: "pmh",
    payload: { item: "amoxicillin", qty: 120, requestedAt: "2026-02-22T08:10:00.000Z" },
    createdAt: "2026-02-22T08:10:00.000Z",
    status: "pending",
  },
  {
    id: "t_seed_2",
    type: "booking_request",
    fromFacility: "bdf_clinic",
    toFacility: "pmh",
    payload: { item: "MRI Scanner", qty: 1, requestedAt: "2026-02-22T09:05:00.000Z" },
    createdAt: "2026-02-22T09:05:00.000Z",
    status: "pending",
  },
];

const defaultFacilities: Facility[] = [
  {
    id: "pmh",
    facility: "Princess Marina Hospital",
    location: "Gaborone",
    distance: 2.1,
    stock: {
      paracetamol: 120,
      amoxicillin: 180,
      ibuprofen: 95,
      insulin: 45,
      metformin: 140,
      amlodipine: 160,
      losartan: 90,
      atorvastatin: 110,
      omeprazole: 200,
      ceftriaxone: 60,
      ciprofloxacin: 80,
      azithromycin: 70,
      clopidogrel: 55,
      aspirin: 220,
      furosemide: 75,
      salbutamol: 130,
      prednisolone: 65,
      hydroxychloroquine: 40,
      diclofenac: 85,
      zinc: 300,
    },
    equipment: {
      "MRI Scanner": "available",
      "CT Scanner": "busy",
      "X-Ray Machine": "available",
    },
    specialists: {
      Cardiologist: "available",
      Radiographer: "busy",
      Dentist: "available",
      "General Practitioner": "available",
    },
    mapUrl: "https://maps.google.com/?q=Princess+Marina+Hospital",
  },
  {
    id: "skmth",
    facility: "Sir Ketumile Masire Hospital",
    location: "Gaborone",
    distance: 5.4,
    stock: {
      insulin: 120,
      amoxicillin: 240,
      paracetamol: 80,
      metformin: 210,
      amlodipine: 135,
      ceftriaxone: 55,
      ciprofloxacin: 70,
      azithromycin: 65,
      ibuprofen: 95,
      losartan: 100,
      aspirin: 150,
      omeprazole: 120,
      diclofenac: 75,
      salbutamol: 90,
    },
    equipment: { Ultrasound: "available", "MRI Scanner": "busy" },
    specialists: { Cardiologist: "available", Oncologist: "available" },
    mapUrl: "https://maps.google.com/?q=Sir+Ketumile+Masire+Teaching+Hospital",
  },
  {
    id: "ub_clinic",
    facility: "UB Clinic",
    location: "Gaborone",
    distance: 3.2,
    stock: {
      insulin: 15,
      paracetamol: 140,
      amoxicillin: 65,
      ibuprofen: 85,
      metformin: 75,
      amlodipine: 60,
      losartan: 40,
      omeprazole: 90,
      aspirin: 110,
      ceftriaxone: 20,
      azithromycin: 35,
      furosemide: 30,
      salbutamol: 55,
    },
    equipment: { Ultrasound: "available" },
    specialists: { "General Practitioner": "available", Nurse: "available" },
  },
  {
    id: "bdf_clinic",
    facility: "BDF Clinic",
    location: "Mogoditshane",
    distance: 8.1,
    stock: {
      paracetamol: 100,
      amoxicillin: 40,
      ibuprofen: 70,
      metformin: 50,
      amlodipine: 45,
      aspirin: 80,
      omeprazole: 60,
      diclofenac: 55,
      salbutamol: 35,
    },
    equipment: { "X-Ray Machine": "available" },
    specialists: { Dentist: "available", Nurse: "available" },
  },
];

const defaultPatients = [
  {
    id: "BW123456",
    name: "Mma Boitumelo",
    age: 58,
    room: "Ward 3B, Bed 4",
    condition: "Post-op Cardiac",
    nextMed: "10:30 AM – Aspirin",
    vitals: { bp: "128/82", hr: 76, temp: "36.8°C", spo2: "98%" },
    alerts: [],
    complaint: "Recovery"
  },
  {
    id: "BW789012",
    name: "Rra Kagiso",
    age: 62,
    room: "Ward 3B, Bed 2",
    condition: "Heart Failure",
    nextMed: "09:00 AM – Furosemide",
    vitals: { bp: "142/90", hr: 88, temp: "37.1°C", spo2: "94%" },
    alerts: ["High BP", "Low SpO₂"],
    complaint: "Shortness of breath"
  }
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
    write(STORAGE_KEYS.TASKS, defaultTasks);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    write(STORAGE_KEYS.PATIENTS, defaultPatients);
  }
}

export async function getPatients(): Promise<any[]> {
  initMock();
  const p = read<any[]>(STORAGE_KEYS.PATIENTS, defaultPatients);
  return delay(p);
}

export async function addPatient(patient: any): Promise<any> {
  initMock();
  const patients = read<any[]>(STORAGE_KEYS.PATIENTS, defaultPatients);
  const newP = {
    id: "BW" + Math.floor(Math.random() * 899999 + 100000),
    ...patient,
    vitals: { bp: "120/80", hr: 72, temp: "36.6°C", spo2: "98%" },
    alerts: []
  };
  patients.unshift(newP);
  write(STORAGE_KEYS.PATIENTS, patients);
  return delay(newP);
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
