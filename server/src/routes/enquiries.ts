import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import prisma from "../prisma";

const router = express.Router();

/**
 * GET /api/enquiries
 * List all enquiry leads with optional filters: ?status=X&search=X.
 * Ordered by createdAt descending.
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
        { name: { contains: term } },
        { email: { contains: term } },
        { mobile: { contains: term } },
        { program: { contains: term } },
        { city: { contains: term } },
        { state: { contains: term } },
        { qualification: { contains: term } },
      ];
    }

    const enquiries = await prisma.enquiryLead.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(enquiries);
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});

/**
 * GET /api/enquiries/:id
 * Retrieve a single enquiry lead by UUID.
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const enquiry = await prisma.enquiryLead.findUnique({
      where: { id },
    });

    if (!enquiry) {
      return res.status(404).json({ error: "Enquiry lead not found" });
    }

    return res.status(200).json(enquiry);
  } catch (error) {
    console.error("Error fetching enquiry lead:", error);
    return res.status(500).json({ error: "Failed to fetch enquiry lead" });
  }
});

/**
 * POST /api/enquiries
 * Create a new enquiry lead.
 * Generates UUID id.
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      mobile,
      email,
      city,
      state,
      qualification,
      yearOfPassing,
      program,
      query,
      date,
      status,
    } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!mobile || typeof mobile !== "string" || !mobile.trim()) {
      return res.status(400).json({ error: "Mobile number is required" });
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }

    const leadDate =
      date && typeof date === "string" && date.trim()
        ? date.trim()
        : new Date().toISOString().split("T")[0];

    const newLead = await prisma.enquiryLead.create({
      data: {
        id: uuidv4(),
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        city: city ? String(city).trim() : "",
        state: state ? String(state).trim() : "",
        qualification: qualification ? String(qualification).trim() : "",
        yearOfPassing: yearOfPassing ? String(yearOfPassing).trim() : "",
        program: program ? String(program).trim() : "",
        query: query ? String(query).trim() : null,
        date: leadDate,
        status: status ? String(status).trim() : "New",
      },
    });

    return res.status(201).json(newLead);
  } catch (error) {
    console.error("Error creating enquiry lead:", error);
    return res.status(500).json({ error: "Failed to create enquiry lead" });
  }
});

/**
 * PUT /api/enquiries/:id
 * Update an enquiry lead by UUID.
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.enquiryLead.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Enquiry lead not found" });
    }

    const {
      name,
      mobile,
      email,
      city,
      state,
      qualification,
      yearOfPassing,
      program,
      query,
      date,
      status,
    } = req.body;

    const dataToUpdate: any = {};

    if (name !== undefined) dataToUpdate.name = String(name).trim();
    if (mobile !== undefined) dataToUpdate.mobile = String(mobile).trim();
    if (email !== undefined) dataToUpdate.email = String(email).trim();
    if (city !== undefined) dataToUpdate.city = String(city).trim();
    if (state !== undefined) dataToUpdate.state = String(state).trim();
    if (qualification !== undefined) dataToUpdate.qualification = String(qualification).trim();
    if (yearOfPassing !== undefined) dataToUpdate.yearOfPassing = String(yearOfPassing).trim();
    if (program !== undefined) dataToUpdate.program = String(program).trim();
    if (query !== undefined) dataToUpdate.query = query ? String(query).trim() : null;
    if (date !== undefined) dataToUpdate.date = String(date).trim();
    if (status !== undefined) dataToUpdate.status = String(status).trim();

    const updated = await prisma.enquiryLead.update({
      where: { id },
      data: dataToUpdate,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating enquiry lead:", error);
    return res.status(500).json({ error: "Failed to update enquiry lead" });
  }
});

/**
 * DELETE /api/enquiries/:id
 * Delete an enquiry lead by UUID.
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.enquiryLead.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Enquiry lead not found" });
    }

    await prisma.enquiryLead.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Enquiry lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting enquiry lead:", error);
    return res.status(500).json({ error: "Failed to delete enquiry lead" });
  }
});

export default router;
