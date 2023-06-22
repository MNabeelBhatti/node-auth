import { Router } from "express";
import userRoutes from "./users.routes.mjs";
import authRoutes from "./auth.routes.mjs";

import ejs from "ejs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

let students = [
  { name: "Joy", email: "joy@example.com", city: "New York", country: "USA" },
  {
    name: "John",
    email: "John@example.com",
    city: "San Francisco",
    country: "USA",
  },
  {
    name: "Clark",
    email: "Clark@example.com",
    city: "Seattle",
    country: "USA",
  },
  {
    name: "Watson",
    email: "Watson@example.com",
    city: "Boston",
    country: "USA",
  },
  {
    name: "Tony",
    email: "Tony@example.com",
    city: "Los Angels",
    country: "USA",
  },
];

router.get("/", async (req, res) => {
  res.render("index", { title: "Landing" });
});
router.get("/home", async (req, res) => {
  let item = req.cookies?.auth;
  let auth = JSON.parse(item || "{}");
  if (auth?.token) {
    res.render("home", { title: "Home", user: auth?.user });
  } else {
    res.redirect("/");
  }
});
async function convertDivToPDF(html) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();

  return pdfBuffer;
}
router.get("/html-to-pdf", async (req, res, next) => {
  try {
    ejs.renderFile(
      join(__dirname, "../views/template.ejs"),
      { students: students },
      async (err, data) => {
        if (err) {
          res.status(404).json({ error: { messgae: err } });
        }
        const pdf = await convertDivToPDF(data);
        console.log(pdf);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="output.pdf"'
        );
        res.send(pdf);
      }
    );
  } catch (error) {
    next(error);
  }
});
router.get("/nft-img", async (req, res, next) => {
  try {
    return res.json(
      {
        name: "4th nft",
        description: "plzz ho ja",
        image:
          "https://res.cloudinary.com/dhjhkqarn/image/upload/v1687346892/mnv0xhuycvxvtl31a0cw.jpg",
      }
    //   {
    //   message: "nft image",
    //   payload: {
    //     name: "4th nft",
    //     description: "plzz ho ja",
    //     image:
    //       "https://res.cloudinary.com/dhjhkqarn/image/upload/v1687346892/mnv0xhuycvxvtl31a0cw.jpg",
    //   },
    // }
    );
  } catch (error) {
    next(error);
  }
});
//Authenticated
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
export default router;
