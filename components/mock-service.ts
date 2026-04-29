type AvailabilityStatus = "Available" | "Limited" | "Out of Stock";
type WardAvailabilityStatus = "Available" | "Limited" | "Full";
type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
type ResourceCategory = "medication" | "blood" | "bed" | "equipment" | "specialist";

type UpdateMeta = {
  last_updated: string;
  updated_by: string;
};

type WardCapacity = {
  ward_name: string;
  ward_type: string;
  total_beds: number;
  available_beds: number;
  last_updated: string;
  updated_by: string;
};

type Facility = {
  id: string;
  facility: string;
  location?: string;
  distance?: number;
  stock: Record<string, number>;
  bloodStock: Record<BloodType, number>;
  wards: WardCapacity[];
  medicineUpdates: Record<string, UpdateMeta>;
  bloodUpdates: Record<BloodType, UpdateMeta>;
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

const BLOOD_TYPES: BloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function titleCase(value: string) {
  return value
    .split(" ")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : part))
    .join(" ");
}

function getAvailabilityStatusFromQty(qty: number): AvailabilityStatus {
  if (qty <= 0) return "Out of Stock";
  if (qty <= 50) return "Limited";
  return "Available";
}

function getBloodStatusFromQty(qty: number): AvailabilityStatus {
  if (qty <= 0) return "Out of Stock";
  if (qty <= 5) return "Limited";
  return "Available";
}

function getWardStatusFromAvailable(availableBeds: number, totalBeds: number): WardAvailabilityStatus {
  if (availableBeds <= 0) return "Full";
  if (availableBeds / Math.max(totalBeds, 1) <= 0.2) return "Limited";
  return "Available";
}

function withNowMeta(updatedBy = "system_seed"): UpdateMeta {
  return { last_updated: new Date().toISOString(), updated_by: updatedBy };
}

function createBloodUpdateMap(updatedBy = "system_seed"): Record<BloodType, UpdateMeta> {
  const meta = withNowMeta(updatedBy);
  return BLOOD_TYPES.reduce(
    (acc, type) => ({ ...acc, [type]: { ...meta } }),
    {} as Record<BloodType, UpdateMeta>,
  );
}

function createMedicineUpdateMap(stock: Record<string, number>, updatedBy = "system_seed"): Record<string, UpdateMeta> {
  const meta = withNowMeta(updatedBy);
  const updates: Record<string, UpdateMeta> = {};
  Object.keys(stock).forEach((medicine) => {
    updates[medicine] = { ...meta };
  });
  return updates;
}

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
    bloodStock: {
      "A+": 18,
      "A-": 7,
      "B+": 14,
      "B-": 4,
      "AB+": 8,
      "AB-": 2,
      "O+": 21,
      "O-": 6,
    },
    wards: [
      {
        ward_name: "ICU",
        ward_type: "Critical Care",
        total_beds: 24,
        available_beds: 3,
        ...withNowMeta("ward_admin_pmh"),
      },
      {
        ward_name: "Maternity Ward",
        ward_type: "Maternity",
        total_beds: 36,
        available_beds: 11,
        ...withNowMeta("ward_admin_pmh"),
      },
      {
        ward_name: "Surgical Ward",
        ward_type: "Surgery",
        total_beds: 42,
        available_beds: 0,
        ...withNowMeta("ward_admin_pmh"),
      },
    ],
    medicineUpdates: createMedicineUpdateMap(
      {
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
      "pharmacy_pmh",
    ),
    bloodUpdates: createBloodUpdateMap("lab_pmh"),
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
    bloodStock: {
      "A+": 9,
      "A-": 2,
      "B+": 8,
      "B-": 1,
      "AB+": 4,
      "AB-": 1,
      "O+": 16,
      "O-": 3,
    },
    wards: [
      {
        ward_name: "Emergency Ward",
        ward_type: "Emergency",
        total_beds: 28,
        available_beds: 4,
        ...withNowMeta("ward_admin_skmth"),
      },
      {
        ward_name: "Medical Ward A",
        ward_type: "Internal Medicine",
        total_beds: 34,
        available_beds: 6,
        ...withNowMeta("ward_admin_skmth"),
      },
      {
        ward_name: "Pediatric Ward",
        ward_type: "Pediatrics",
        total_beds: 26,
        available_beds: 1,
        ...withNowMeta("ward_admin_skmth"),
      },
    ],
    medicineUpdates: createMedicineUpdateMap(
      {
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
      "pharmacy_skmth",
    ),
    bloodUpdates: createBloodUpdateMap("lab_skmth"),
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
    bloodStock: {
      "A+": 5,
      "A-": 1,
      "B+": 4,
      "B-": 0,
      "AB+": 2,
      "AB-": 0,
      "O+": 7,
      "O-": 1,
    },
    wards: [
      {
        ward_name: "General Ward",
        ward_type: "General Medicine",
        total_beds: 20,
        available_beds: 2,
        ...withNowMeta("ward_admin_ub"),
      },
      {
        ward_name: "Maternity Ward",
        ward_type: "Maternity",
        total_beds: 16,
        available_beds: 5,
        ...withNowMeta("ward_admin_ub"),
      },
    ],
    medicineUpdates: createMedicineUpdateMap(
      {
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
      "pharmacy_ub",
    ),
    bloodUpdates: createBloodUpdateMap("lab_ub"),
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
    bloodStock: {
      "A+": 3,
      "A-": 1,
      "B+": 3,
      "B-": 0,
      "AB+": 1,
      "AB-": 0,
      "O+": 5,
      "O-": 1,
    },
    wards: [
      {
        ward_name: "Observation Ward",
        ward_type: "Observation",
        total_beds: 14,
        available_beds: 0,
        ...withNowMeta("ward_admin_bdf"),
      },
      {
        ward_name: "Maternity Ward",
        ward_type: "Maternity",
        total_beds: 12,
        available_beds: 3,
        ...withNowMeta("ward_admin_bdf"),
      },
    ],
    medicineUpdates: createMedicineUpdateMap(
      {
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
      "pharmacy_bdf",
    ),
    bloodUpdates: createBloodUpdateMap("lab_bdf"),
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

function normalizeFacility(facility: any): Facility {
  const seeded = defaultFacilities.find((item) => item.id === facility.id);
  const mergedStock = { ...(seeded?.stock ?? {}), ...(facility.stock ?? {}) };
  const mergedBloodStock = {
    ...(seeded?.bloodStock ?? {}),
    ...(facility.bloodStock ?? {}),
  } as Record<BloodType, number>;
  const wards: WardCapacity[] = (facility.wards ?? seeded?.wards ?? []).map((ward: any) => ({
    ward_name: ward.ward_name ?? ward.wardName ?? "General Ward",
    ward_type: ward.ward_type ?? ward.wardType ?? "General",
    total_beds: Number(ward.total_beds ?? ward.totalBeds ?? 0),
    available_beds: Number(ward.available_beds ?? ward.availableBeds ?? 0),
    last_updated: ward.last_updated ?? ward.lastUpdated ?? new Date().toISOString(),
    updated_by: ward.updated_by ?? ward.updatedBy ?? "system_seed",
  }));

  const medicineUpdates = {
    ...createMedicineUpdateMap(mergedStock),
    ...(facility.medicineUpdates ?? {}),
  };

  const bloodUpdates = {
    ...createBloodUpdateMap(),
    ...(facility.bloodUpdates ?? {}),
  } as Record<BloodType, UpdateMeta>;

  const normalized: Facility = {
    id: facility.id,
    facility: facility.facility ?? seeded?.facility ?? "Unknown Facility",
    location: facility.location ?? seeded?.location,
    distance: facility.distance ?? seeded?.distance,
    stock: mergedStock,
    bloodStock: mergedBloodStock,
    wards,
    medicineUpdates,
    bloodUpdates,
    equipment: { ...(seeded?.equipment ?? {}), ...(facility.equipment ?? {}) },
    specialists: { ...(seeded?.specialists ?? {}), ...(facility.specialists ?? {}) },
    mapUrl: facility.mapUrl ?? seeded?.mapUrl,
  };

  return normalized;
}

function normalizeFacilities(facilities: any[]): Facility[] {
  return facilities.map((facility) => normalizeFacility(facility));
}

export function initMock() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(STORAGE_KEYS.FACILITIES)) {
    write(STORAGE_KEYS.FACILITIES, defaultFacilities);
  } else {
    const existing = read<any[]>(STORAGE_KEYS.FACILITIES, defaultFacilities as any[]);
    const normalized = normalizeFacilities(existing);
    write(STORAGE_KEYS.FACILITIES, normalized);
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
  const f = normalizeFacilities(read<any[]>(STORAGE_KEYS.FACILITIES, defaultFacilities as any[]));
  write(STORAGE_KEYS.FACILITIES, f);
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
  found.medicineUpdates[medicine] = withNowMeta("facility_pharmacist");
  write(STORAGE_KEYS.FACILITIES, facilities);
  evtTarget.dispatchEvent(
    new CustomEvent("facilities:changed", { detail: found }),
  );
  return delay(found);
}

export async function findMedicine(query: string): Promise<any[]> {
  initMock();
  const q = query.trim().toLowerCase();
  const facilities = normalizeFacilities(read<any[]>(
    STORAGE_KEYS.FACILITIES,
    defaultFacilities as any[],
  ));
  const results: any[] = [];

  facilities.forEach((f) => {
    Object.entries(f.stock).forEach(([med, qty]) => {
      if (med.toLowerCase().includes(q)) {
        const meta = f.medicineUpdates[med] ?? withNowMeta("system_seed");
        results.push({
          resource_type: "medication",
          resource_category: "medication",
          resource_name: titleCase(med),
          medicine_name: titleCase(med),
          facility_id: f.id,
          facility: f.facility,
          facilityId: f.id,
          facilityName: f.facility,
          item: titleCase(med),
          availability_status: getAvailabilityStatusFromQty(Number(qty)),
          status: getAvailabilityStatusFromQty(Number(qty)),
          last_updated: meta.last_updated,
          updated_by: meta.updated_by,
          location: f.location,
        });
      }
    });
  });

  return delay(results);
}

export async function getBloodAvailability(query = ""): Promise<any[]> {
  initMock();
  const q = query.trim().toLowerCase();
  const facilities = normalizeFacilities(
    read<any[]>(STORAGE_KEYS.FACILITIES, defaultFacilities as any[]),
  );
  const results: any[] = [];

  facilities.forEach((facility) => {
    BLOOD_TYPES.forEach((bloodType) => {
      if (q && !bloodType.toLowerCase().includes(q) && !facility.facility.toLowerCase().includes(q)) return;
      const qty = Number(facility.bloodStock[bloodType] ?? 0);
      const meta = facility.bloodUpdates[bloodType] ?? withNowMeta("system_seed");
      results.push({
        resource_type: "blood",
        resource_category: "blood",
        resource_name: bloodType,
        facility_id: facility.id,
        facility: facility.facility,
        facilityId: facility.id,
        facilityName: facility.facility,
        blood_type: bloodType,
        item: bloodType,
        availability_status: getBloodStatusFromQty(qty),
        status: getBloodStatusFromQty(qty),
        last_updated: meta.last_updated,
        updated_by: meta.updated_by,
        location: facility.location,
      });
    });
  });

  return delay(results);
}

export async function getWardAvailability(query = ""): Promise<any[]> {
  initMock();
  const q = query.trim().toLowerCase();
  const facilities = normalizeFacilities(
    read<any[]>(STORAGE_KEYS.FACILITIES, defaultFacilities as any[]),
  );
  const results: any[] = [];

  facilities.forEach((facility) => {
    facility.wards.forEach((ward) => {
      if (
        q &&
        !ward.ward_name.toLowerCase().includes(q) &&
        !ward.ward_type.toLowerCase().includes(q) &&
        !facility.facility.toLowerCase().includes(q)
      ) {
        return;
      }

      results.push({
        resource_type: "bed",
        resource_category: "bed",
        resource_name: ward.ward_name,
        facility_id: facility.id,
        facility: facility.facility,
        facilityId: facility.id,
        facilityName: facility.facility,
        ward_name: ward.ward_name,
        ward_type: ward.ward_type,
        item: ward.ward_name,
        availability_status: getWardStatusFromAvailable(ward.available_beds, ward.total_beds),
        status: getWardStatusFromAvailable(ward.available_beds, ward.total_beds),
        last_updated: ward.last_updated,
        updated_by: ward.updated_by,
        location: facility.location,
      });
    });
  });

  return delay(results);
}

export async function searchResourceAvailability(filters: {
  query?: string;
  facilityId?: string;
  wardName?: string;
  category?: ResourceCategory | "all";
}): Promise<any[]> {
  const query = (filters.query ?? "").trim().toLowerCase();
  const category = filters.category ?? "all";

  const [medications, blood, wards] = await Promise.all([
    findMedicine(query),
    getBloodAvailability(query),
    getWardAvailability(query),
  ]);

  const scoped = [...medications, ...blood, ...wards].filter((item) => {
    if (category !== "all" && item.resource_category !== category) return false;
    if (filters.facilityId && item.facility_id !== filters.facilityId) return false;
    if (filters.wardName && !(item.ward_name ?? "").toLowerCase().includes(filters.wardName.toLowerCase())) return false;

    if (!query) return true;
    const haystack = [
      item.resource_name,
      item.medicine_name,
      item.blood_type,
      item.facility,
      item.ward_name,
      item.resource_category,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  return scoped.sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime());
}

export async function findEquipment(query: string): Promise<any[]> {
  initMock();
  const q = query.trim().toLowerCase();
  const facilities = normalizeFacilities(read<any[]>(
    STORAGE_KEYS.FACILITIES,
    defaultFacilities as any[],
  ));
  const results: any[] = [];

  facilities.forEach((f) => {
    Object.entries(f.equipment).forEach(([name, status]) => {
      if (name.toLowerCase().includes(q)) {
        results.push({
          resource_type: "equipment",
          resource_category: "equipment",
          resource_name: name,
          facility_id: f.id,
          facility: f.facility,
          facilityId: f.id,
          facilityName: f.facility,
          item: name,
          status:
            status === "available"
              ? "Available"
              : status === "busy"
                ? "Busy"
                : "Maintenance",
          availability_status: status === "available" ? "Available" : "Limited",
          last_updated: new Date().toISOString(),
          updated_by: "biomedical_team",
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
  const facilities = normalizeFacilities(read<any[]>(
    STORAGE_KEYS.FACILITIES,
    defaultFacilities as any[],
  ));
  const results: any[] = [];

  facilities.forEach((f) => {
    Object.entries(f.specialists).forEach(([name, status]) => {
      if (name.toLowerCase().includes(q)) {
        results.push({
          resource_type: "specialist",
          resource_category: "specialist",
          resource_name: name,
          facility_id: f.id,
          facility: f.facility,
          facilityId: f.id,
          facilityName: f.facility,
          item: name,
          status:
            status === "available"
              ? "On Duty"
              : status === "busy"
                ? "Busy"
                : "Off Duty",
          availability_status: status === "available" ? "Available" : "Limited",
          last_updated: new Date().toISOString(),
          updated_by: "hr_team",
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
