// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res
    .status(200)
    .json({
      name: "Swift Pay",
      description:
        "An AI powered Payroll and Invoice Processing Application Built on Flow Blockchain",
    });
}
