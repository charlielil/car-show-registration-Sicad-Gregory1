import { ApiError } from "./http.js";

/**
 * Local sample data that follows the shared API contract.
 * getRegistrations() / getSummary() filter, page and total it in the browser,
 * exactly like the C# API does on the server.
 */

const FEES = { Exhibitor: 1500, Competitor: 2500, VIP: 5000 };

// [name, contact, email, address, car, plate, type, status, amountPaid]
const ROWS = [
  ["Juan Dela Cruz", "09171234567", "juan@example.com", "123 Rizal St., Naga City", "Toyota Supra MK4", "ABC 1234", "Competitor", "Confirmed", 1000],
  ["Maria Santos", "09182345678", "maria.santos@example.com", "45 Magsaysay Ave., Legazpi City", "Honda Civic Type R", "NBD 4521", "VIP", "CheckedIn", 5000],
  ["Jose Reyes", "09193456789", "jose.reyes@example.com", "8 Burgos St., Sorsogon City", "Mitsubishi Lancer Evo IX", "SOR 7788", "Competitor", "Pending", 0],
  ["Ana Garcia", "09204567890", "ana.garcia@example.com", "22 Peñafrancia Ave., Naga City", "Mazda MX-5 Miata", "CAM 3310", "Exhibitor", "Confirmed", 1500],
  ["Miguel Bautista", "09215678901", "miguel.b@example.com", "17 Quezon St., Iriga City", "Subaru WRX STI", "IRI 9021", "Competitor", "CheckedIn", 2500],
  ["Angela Flores", "09226789012", "angela.flores@example.com", "5 Rizal St., Daraga, Albay", "Nissan Skyline GT-R R34", "ALB 1134", "VIP", "Confirmed", 2500],
  ["Carlos Mendoza", "09237890123", "carlos.m@example.com", "31 Del Rosario St., Naga City", "Ford Mustang GT", "NAG 6642", "Exhibitor", "Pending", 750],
  ["Patricia Ramos", "09248901234", "patricia.ramos@example.com", "9 Mabini St., Legazpi City", "Volkswagen Golf GTI", "LEG 2287", "Competitor", "Cancelled", 0],
  ["Rafael Aquino", "09259012345", "rafael.aquino@example.com", "64 Gubat Rd., Sorsogon City", "Toyota Corolla AE86", "SOR 5509", "Competitor", "Confirmed", 2500],
  ["Camille Navarro", "09260123456", "camille.n@example.com", "12 Elias Angeles St., Naga City", "Honda City RS", "NAG 8873", "Exhibitor", "CheckedIn", 1500],
  ["Gabriel Castillo", "09171230001", "gabriel.c@example.com", "70 Rizal St., Bulan, Sorsogon", "Mazda RX-7 FD", "BUL 4410", "VIP", "Pending", 0],
  ["Sofia Villanueva", "09181230002", "sofia.v@example.com", "3 Pacific Dr., Legazpi City", "Porsche 911 Carrera", "LEG 9001", "VIP", "CheckedIn", 5000],
  ["Daniel Cruz", "09191230003", "daniel.cruz@example.com", "28 Panganiban Dr., Naga City", "Toyota GR86", "NAG 1205", "Competitor", "Confirmed", 1250],
  ["Isabella Torres", "09201230004", "isabella.t@example.com", "6 Aquino St., Iriga City", "Mini Cooper S", "IRI 3347", "Exhibitor", "Confirmed", 1500],
  ["Nathaniel Lim", "09211230005", "nathaniel.lim@example.com", "41 Roxas Blvd., Sorsogon City", "Chevrolet Camaro SS", "SOR 6120", "Competitor", "Pending", 0],
  ["Bianca Fernandez", "09221230006", "bianca.f@example.com", "19 Misericordia St., Naga City", "BMW M3 E46", "NAG 7754", "VIP", "Confirmed", 3000],
  ["Marco Evangelista", "09231230007", "marco.e@example.com", "55 Rizal St., Daraga, Albay", "Honda S2000", "ALB 2468", "Competitor", "CheckedIn", 2500],
  ["Chloe Ramirez", "09241230008", "chloe.r@example.com", "2 Magallanes St., Legazpi City", "Suzuki Jimny Sierra", "LEG 5531", "Exhibitor", "Cancelled", 0],
  ["Luis Santiago", "09251230009", "luis.s@example.com", "13 Liboton St., Naga City", "Nissan 370Z", "NAG 3098", "Competitor", "Confirmed", 2500],
  ["Andrea Mercado", "09261230010", "andrea.m@example.com", "37 Del Pilar St., Sorsogon City", "Mercedes-Benz C63 AMG", "SOR 8812", "VIP", "Pending", 1000],
  ["Paolo Gonzales", "09171230011", "paolo.g@example.com", "88 Tabaco Rd., Legazpi City", "Mitsubishi Eclipse GSX", "LEG 7019", "Exhibitor", "Confirmed", 0],
  ["Mikaela Herrera", "09181230012", "mikaela.h@example.com", "14 Carolina Rd., Naga City", "Volkswagen Beetle 1967", "NAG 2290", "Exhibitor", "CheckedIn", 1500],
  ["Enzo Valdez", "09191230013", "enzo.v@example.com", "26 Rizal St., Irosin, Sorsogon", "Dodge Challenger R/T", "IRO 6643", "Competitor", "Pending", 500],
  ["Beatriz Salazar", "09201230014", "beatriz.s@example.com", "7 Hernandez St., Iriga City", "Lexus IS 300", "IRI 1186", "VIP", "Confirmed", 5000],
  ["Andres Domingo", "09211230015", "andres.d@example.com", "50 Bonifacio St., Legazpi City", "Datsun 240Z", "LEG 4402", "Competitor", "Cancelled", 0],
  ["Rhea Manalo", "09221230016", "rhea.m@example.com", "21 Lakandula St., Naga City", "Toyota Celica GT-Four", "NAG 5167", "Exhibitor", "Confirmed", 1500],
];

function buildRegistration(row, index) {
  const [participantName, contactNumber, email, address, carMakeModel, plateNumber, registrationType, status, amountPaid] = row;
  const registrationFee = FEES[registrationType];
  const paymentStatus =
    amountPaid === 0 ? "Unpaid" : amountPaid < registrationFee ? "Partial" : "Paid";

  // Oldest first in ROWS, one registration every ~7 hours starting Feb 1, 2027.
  const date = new Date(Date.UTC(2027, 1, 1, 0, 30) + index * 7 * 60 * 60 * 1000);

  return {
    id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    registrationNumber: `CS27-${String(index + 1).padStart(4, "0")}`,
    registrationDate: date.toISOString(),
    participantName,
    contactNumber,
    email,
    address,
    carMakeModel,
    plateNumber,
    registrationType,
    status,
    registrationFee,
    amountPaid,
    paymentStatus,
  };
}

// Newest first, same ordering as the C# API.
let registrations = ROWS.map(buildRegistration).reverse();

/** Pretend to be a network call (so loading states can be seen), and honour cancellation. */
function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, ms);
    if (signal?.aborted) return abort();
    signal?.addEventListener("abort", abort, { once: true });
  });
}

export async function getRegistrations(
  { participantName = "", type = "", status = "", page = 1, pageSize = 10 } = {},
  { signal } = {},
) {
  await delay(450, signal);

  const search = participantName.trim().toLowerCase();
  const filtered = registrations.filter(
    (r) =>
      (!search || r.participantName.toLowerCase().includes(search)) &&
      (!type || r.registrationType.toLowerCase() === type.toLowerCase()) &&
      (!status || r.status.toLowerCase() === status.toLowerCase()),
  );

  const totalCount = filtered.length;
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize),
    page,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function getSummary({ signal } = {}) {
  await delay(450, signal);

  const count = (status) => registrations.filter((r) => r.status === status).length;
  // Cancelled registrations are left out of the money totals (same rule as the backend).
  const active = registrations.filter((r) => r.status !== "Cancelled");
  const totalFees = active.reduce((sum, r) => sum + r.registrationFee, 0);
  const totalPayments = active.reduce((sum, r) => sum + r.amountPaid, 0);

  return {
    totalRegistrations: registrations.length,
    confirmed: count("Confirmed"),
    checkedIn: count("CheckedIn"),
    pending: count("Pending"),
    cancelled: count("Cancelled"),
    totalFees,
    totalPayments,
    uncollectedPayments: totalFees - totalPayments,
  };
}

export async function getRegistrationById(id, { signal } = {}) {
  await delay(300, signal);
  const found = registrations.find((r) => r.id === id);
  if (!found) throw new ApiError("Registration not found.", { status: 404 });
  return found;
}

export async function createRegistration(payload) {
  await delay(500);

  const errors = {};
  const required = ["participantName", "contactNumber", "email", "address", "carMakeModel", "plateNumber"];
  for (const key of required) {
    if (!String(payload[key] ?? "").trim()) errors[key] = "This field is required.";
  }
  if (payload.contactNumber && !/^09\d{9}$/.test(payload.contactNumber)) {
    errors.contactNumber = "Contact number must be a Philippine mobile number in the format 09XXXXXXXXX (11 digits).";
  }
  if (payload.email && !/^\S+@\S+\.\S+$/.test(payload.email)) {
    errors.email = "Enter a valid email address.";
  }
  const fee = FEES[payload.registrationType];
  if (!fee) errors.registrationType = "Registration type must be Exhibitor, Competitor or VIP.";
  const paid = Number(payload.amountPaid);
  if (Number.isNaN(paid) || paid < 0) errors.amountPaid = "Amount paid must be 0 or more.";
  else if (fee && paid > fee) errors.amountPaid = `Amount paid cannot be more than the registration fee (${fee}).`;

  if (Object.keys(errors).length) {
    throw new ApiError("Some of the information is not valid.", { status: 400, fieldErrors: errors });
  }

  const plateNumber = payload.plateNumber.trim().toUpperCase();
  if (registrations.some((r) => r.plateNumber === plateNumber)) {
    throw new ApiError(`A registration with plate number '${plateNumber}' already exists.`, {
      status: 409,
      fieldErrors: { plateNumber: `A registration with plate number '${plateNumber}' already exists.` },
    });
  }

  const nextNumber = registrations.length + 1;
  const created = {
    id: crypto.randomUUID(),
    registrationNumber: `CS27-${String(nextNumber).padStart(4, "0")}`,
    registrationDate: new Date().toISOString(),
    participantName: payload.participantName.trim(),
    contactNumber: payload.contactNumber.trim(),
    email: payload.email.trim(),
    address: payload.address.trim(),
    carMakeModel: payload.carMakeModel.trim(),
    plateNumber,
    registrationType: payload.registrationType,
    status: "Pending",
    registrationFee: fee,
    amountPaid: paid,
    paymentStatus: paid === 0 ? "Unpaid" : paid < fee ? "Partial" : "Paid",
  };
  registrations = [created, ...registrations];
  return created;
}
