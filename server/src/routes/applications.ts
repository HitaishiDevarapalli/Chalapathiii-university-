import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import prisma from "../prisma";

const router = express.Router();

/**
 * GET /api/applications
 * List all applications with optional query filters: ?status=X&search=X.
 * Ordered by submittedAt descending.
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    const where: any = {};

    if (status && typeof status === "string" && status.trim() !== "" && status !== "all") {
      where.status = status.trim();
    }

    if (search && typeof search === "string" && search.trim() !== "") {
      const term = search.trim();
      where.OR = [
        { applicationNo: { contains: term } },
        { fullName: { contains: term } },
        { email: { contains: term } },
        { mobile: { contains: term } },
        { program: { contains: term } },
        { city: { contains: term } },
        { state: { contains: term } },
      ];
    }

    const applications = await prisma.onlineApplication.findMany({
      where,
      orderBy: {
        submittedAt: "desc",
      },
    });

    return res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ error: "Failed to fetch applications" });
  }
});

/**
 * GET /api/applications/:id
 * Retrieve a single application by UUID.
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const application = await prisma.onlineApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    return res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return res.status(500).json({ error: "Failed to fetch application" });
  }
});

/**
 * POST /api/applications
 * Create a new application.
 * Auto-generates applicationNo as 'CU-2026-{count+1}'.
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      mobile,
      state,
      city,
      program,
      qualification,
      yearOfPassing,
      parentName,
      gender,
      dob,
      applicationFeePaid,
      transactionId,
      status,
    } = req.body;

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return res.status(400).json({ error: "Full name is required" });
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!mobile || typeof mobile !== "string" || !mobile.trim()) {
      return res.status(400).json({ error: "Mobile number is required" });
    }
    if (!program || typeof program !== "string" || !program.trim()) {
      return res.status(400).json({ error: "Program is required" });
    }

    // Auto-generate applicationNo as 'CU-2026-{count+1}'
    const totalCount = await prisma.onlineApplication.count();
    let counter = totalCount + 1;
    let applicationNo = `CU-2026-${counter}`;

    // Ensure uniqueness in case of records deleted or custom numbers
    while (await prisma.onlineApplication.findUnique({ where: { applicationNo } })) {
      counter++;
      applicationNo = `CU-2026-${counter}`;
    }

    const application = await prisma.onlineApplication.create({
      data: {
        id: uuidv4(),
        applicationNo,
        fullName: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        state: state ? String(state).trim() : "",
        city: city ? String(city).trim() : null,
        program: program.trim(),
        qualification: qualification ? String(qualification).trim() : "",
        yearOfPassing: yearOfPassing ? String(yearOfPassing).trim() : "",
        parentName: parentName ? String(parentName).trim() : null,
        gender: gender ? String(gender).trim() : null,
        dob: dob ? String(dob).trim() : null,
        applicationFeePaid: Boolean(applicationFeePaid),
        transactionId: transactionId ? String(transactionId).trim() : null,
        status: status ? String(status).trim() : "Submitted",
      },
    });

    return res.status(201).json(application);
  } catch (error) {
    console.error("Error creating application:", error);
    return res.status(500).json({ error: "Failed to create application" });
  }
});

/**
 * PUT /api/applications/:id
 * Update an application by UUID (status changes, review details, etc.).
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.onlineApplication.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }

    const {
      fullName,
      email,
      mobile,
      state,
      city,
      program,
      qualification,
      yearOfPassing,
      parentName,
      gender,
      dob,
      applicationFeePaid,
      transactionId,
      status,
    } = req.body;

    const dataToUpdate: any = {};

    if (fullName !== undefined) dataToUpdate.fullName = String(fullName).trim();
    if (email !== undefined) dataToUpdate.email = String(email).trim();
    if (mobile !== undefined) dataToUpdate.mobile = String(mobile).trim();
    if (state !== undefined) dataToUpdate.state = String(state).trim();
    if (city !== undefined) dataToUpdate.city = city ? String(city).trim() : null;
    if (program !== undefined) dataToUpdate.program = String(program).trim();
    if (qualification !== undefined) dataToUpdate.qualification = String(qualification).trim();
    if (yearOfPassing !== undefined) dataToUpdate.yearOfPassing = String(yearOfPassing).trim();
    if (parentName !== undefined) dataToUpdate.parentName = parentName ? String(parentName).trim() : null;
    if (gender !== undefined) dataToUpdate.gender = gender ? String(gender).trim() : null;
    if (dob !== undefined) dataToUpdate.dob = dob ? String(dob).trim() : null;
    if (applicationFeePaid !== undefined) dataToUpdate.applicationFeePaid = Boolean(applicationFeePaid);
    if (transactionId !== undefined) dataToUpdate.transactionId = transactionId ? String(transactionId).trim() : null;
    if (status !== undefined) dataToUpdate.status = String(status).trim();

    const updated = await prisma.onlineApplication.update({
      where: { id },
      data: dataToUpdate,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating application:", error);
    return res.status(500).json({ error: "Failed to update application" });
  }
});

/**
 * DELETE /api/applications/:id
 * Delete an application by UUID.
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.onlineApplication.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }

    await prisma.onlineApplication.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    return res.status(500).json({ error: "Failed to delete application" });
  }
});

export default router;
